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

// 從資料中統計各產業的實體辦公室和遠端工作的公司數量
export const countIndustryWorkplaceTypes = (data) => {
  // 初始化統計結果物件
  const result = {};

  // 遍歷每一條資料記錄
  data.forEach(record => {
    // 獲取產業和工作型態資訊
    const industry = record.company.industry;
    const workplaceType = record.company.work;

    // 如果這個產業還未在結果中，則初始化
    if (!result[industry]) {
      result[industry] = {
        "實體辦公室": 0,
        "遠端工作": 0,
        "混合制": 0
      };
    }

    // 根據工作型態，對應的計數加1
    result[industry][workplaceType]++;
  });

  // 格式化結果，將數字轉為字串並加上"間"字
  Object.keys(result).forEach(industry => {
    const industryData = result[industry];
    Object.keys(industryData).forEach(type => {
      industryData[type] = `${industryData[type]}間`;
    });
  });

  return result;
};

// 主函數：獲取數據並計算統計結果
export const getIndustryWorkplaceStats = async () => {
  try {
    // 獲取資料
    const data = await getInterviewers();
    
    // 分析資料並返回結果
    return countIndustryWorkplaceTypes(data);
  } catch (error) {
    console.error("處理資料時發生錯誤:", error);
    return {};
  }
};

// 使用範例
const stats = await getIndustryWorkplaceStats();
console.log(JSON.stringify(stats, null, 2));

