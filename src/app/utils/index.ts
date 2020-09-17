class Utils {
  /**
   * Função utilizada para converter datas
   * para o padrão brasileiro
   */
  public parseDate (date: Date) {
    function pStart (num: number): string {
      return num.toString().padStart(2, '0')
    }

    const d = new Date(date)
    const dateParsed = `${pStart(d.getDate())}/${pStart(
      d.getMonth() + 1
    )}/${d.getFullYear().toString()} ${pStart(d.getHours())}:${pStart(
      d.getMinutes()
    )}:${pStart(d.getSeconds())}`

    return dateParsed
  }
}

export default new Utils()
