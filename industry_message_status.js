// 從伺服器取回資料的函數
export const getInterviewers = async function () {
  try {
    const result = await fetch(
      "https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json"
    );
    const data = await result.json();
    return data; // 返回資料
  } catch (error) {
    console.error("取得資料時發生錯誤:", error);
    return []; // 發生錯誤時返回空陣列
  }
};

// industry_message_statistics.js
const analyzeIndustryMessageStats = function (data) {
  // 統計industry_message欄位填寫狀況
  let hasContentCount = 0;
  let noContentCount = 0;

  data.forEach((item) => {
    // 檢查industry_message是否有內容
    if (
      item.company &&
      item.company.industry_message &&
      item.company.industry_message.trim() !== ""
    ) {
      hasContentCount++;
    } else {
      noContentCount++;
    }
  });

  // 按照要求的格式輸出結果
  return [[`有寫${hasContentCount}人`, { no: `沒寫${noContentCount}人` }]];
};

// 使用範例 - 正確串接兩個函數
/*********************** 主要變更部分開始 ***********************/
const processIndustryMessageStatus = async function () {
  const data = await getInterviewers(); // 先從伺服器取得資料
  const statistics = analyzeIndustryMessageStats(data); // 再分析資料
  console.log(JSON.stringify(statistics));
};

// 執行主函數
processIndustryMessageStatus();
/*********************** 主要變更部分結束 ***********************/
