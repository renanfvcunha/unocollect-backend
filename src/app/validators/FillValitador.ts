import { Request, Response, NextFunction } from 'express'

interface Values {
  fieldId: number
  value: string
}

class FillValidator {
  public store (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void {
    const values: Values[] = req.body.values

    if (values.length === 0) {
      return res
        .status(400)
        .json({ msg: 'Verifique seu os campos estão preenchidos.' })
    }

    return next()
  }
}

export default new FillValidator()
