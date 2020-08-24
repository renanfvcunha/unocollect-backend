class Utils {
  /**
   * Função utilizada para converter datas
   * em UTC para datas locais
   */
  public utcToLocalTime (date: Date) {
    const d = new Date(date)
    const newDate = new Date(d.setHours(d.getHours() - 3))
    return newDate
  }
}

export default new Utils()
