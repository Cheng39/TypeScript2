function formatDate(date: string): string {
  const [year, month, day] = date.split('-');//使用‘-’分隔开字串，取得年月日。
  const formattedMonth = parseInt(month, 10).toString();//将月份字串，转换为数字后，再变回字串，移除前缀0
  const formattedDay = parseInt(day, 10).toString();//与月份同理
  return `${year}年${formattedMonth}月${formattedDay}日`;//使用样板字串组合输出格式
  //使用Gemini，0209/1700抄写测试。

  
}
  console.log(formatDate('2024-12-21')); // 預期輸出: 2024年12月21日
  console.log(formatDate('2024-01-21')); // 預期輸出: 2024年1月21日
  console.log(formatDate('2024-12-01')); // 預期輸出: 2024年12月1日