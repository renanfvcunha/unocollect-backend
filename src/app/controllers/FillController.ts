import { Request, Response } from 'express'
import { getRepository, getManager } from 'typeorm'
import { FieldUserValue } from '../models/FieldUserValue'
import { UserForm } from '../models/UserForm'
import { FormStatus } from '../models/FormStatus'
import { Form } from '../models/Form'
import { ImageUserForm } from '../models/ImageUserForm'

interface UserRequest extends Request {
  userId: number
}

interface Location {
  latitude: number
  longitude: number
}

interface Values {
  fieldId: number
  value: string
}

interface ValuesWithId {
  user: number
  fieldId: number
  value: string
}

class FillController {
  public async index (req: UserRequest, res: Response): Promise<Response> {
    const userId = req.userId

    try {
      const forms = await getRepository(Form)
        .createQueryBuilder('form')
        .select([
          'form.id',
          'form.title',
          'form.description',
          'field.id',
          'field.name',
          'field.description'
        ])
        .leftJoin('form.fields', 'field')
        .innerJoin('form.status', 'formStatus')
        .where('formStatus.user_id = :userId', { userId })
        .andWhere('formStatus.status = 0')
        .getMany()

      return res.json(forms)
    } catch (err) {
      return res.status(500).json({
        msg:
          'Erro interno do servidor. Por favor, tente novamente ou contate o suporte.'
      })
    }
  }

  public async store (req: UserRequest, res: Response): Promise<Response> {
    const userId = req.userId
    const { id } = req.params
    const { latitude, longitude }: Location = req.body
    const values: string[] = req.body.values
    const date: string = req.body.date
    const valuesParsed = values.map(value => JSON.parse(value))
    const files = req.files

    const filenames: string[] = []
    if (files) {
      for (let i = 0; i < files.length; i++) {
        filenames.push(files[i].filename)
      }
    }

    /**
     * Verificando se usuário já preencheu o formulário
     */
    const userForm = await getRepository(UserForm).find({
      where: { user: userId, form: Number(id) }
    })
    if (userForm.length !== 0) {
      return res.status(401).json({ msg: 'Você já preencheu este formulário' })
    }

    try {
      await getManager().transaction(async transactionalEntityManager => {
        // Inserindo dados na tabela pivô de usuários e formulários
        const result = await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(UserForm)
          .values([
            {
              latitude: Number(latitude),
              longitude: Number(longitude),
              user: userId,
              form: Number(id),
              created_at: date,
              updated_at: date
            }
          ])
          .execute()

        /**
         * Capturando id inserido na tabela pivô
         */
        const userFormId: number = result.identifiers[0].id

        // Inserindo as respostas na tabela de valores
        const valuesWithId = valuesParsed.map((value: ValuesWithId) => ({
          userForm: userFormId,
          field: value.fieldId,
          value: value.value
        }))

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(FieldUserValue)
          .values(valuesWithId)
          .execute()

        /**
         * Inserindo nomes das imagens na tabela de imagens
         */
        if (filenames.length !== 0) {
          const imagesWithId = filenames.map((filename: string) => ({
            userForm: userFormId,
            name: filename
          }))

          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(ImageUserForm)
            .values(imagesWithId)
            .execute()
        }

        /**
         * Atualizando status do formulario de usuários
         */
        await transactionalEntityManager
          .createQueryBuilder()
          .update(FormStatus)
          .set({ status: 1 })
          .where('user_id = :userId', { userId })
          .andWhere('form_id = :formId', { formId: Number(id) })
          .execute()
      })

      return res.json({ msg: 'Formulário preenchido com sucesso!' })
    } catch (err) {
      return res
        .status(500)
        .json({ msg: 'Houve um erro ao preencher o formulário.' })
    }
  }
}

export default new FillController()
