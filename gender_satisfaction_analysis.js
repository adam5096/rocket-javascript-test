// 這個檔案處理各產業的男女性比例與產業滿意度分析
// 檔名: industry_gender_ratio_satisfaction.js

/**
 * 從伺服器取回前端工程師調查資料
 * @returns {Promise<Array>} 前端工程師調查資料陣列
 */
async function getInterviewers() {
  try {
    // 發送請求獲取GitHub上的資料
    const result = await fetch(
      "https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json"
    );
    // 將回應轉換為JSON格式
    const data = await result.json();
    // 返回解析後的資料
    return data;
  } catch (error) {
    // 如果發生錯誤，記錄錯誤並返回空陣列
    console.error("取得資料時發生錯誤:", error);
    return [];
  }
}

/**
 * 分析各產業的男女比例與滿意度
 * @param {Array} data - 前端工程師調查資料
 * @returns {Object} 各產業的分析結果
 */
function analyzeIndustryGenderData(data) {
  // 創建一個物件來存儲各產業的統計數據
  const industryStats = {};

  // 遍歷所有前端工程師的資料
  data.forEach((person) => {
    // 獲取這個人的產業、性別和滿意度分數
    const industry = person.company.industry;
    const gender = person.gender;
    const score = parseInt(person.company.score);

    // 如果這個產業還沒有在統計物件中，則初始化它
    if (!industryStats[industry]) {
      industryStats[industry] = {
        male: 0, // 男性人數
        female: 0, // 女性人數
        maleScoreSum: 0, // 男性滿意度總和
        femaleScoreSum: 0, // 女性滿意度總和
      };
    }

    // 根據性別增加計數並累加滿意度分數
    if (gender === "男性") {
      industryStats[industry].male += 1;
      industryStats[industry].maleScoreSum += score;
    } else if (gender === "女性") {
      industryStats[industry].female += 1;
      industryStats[industry].femaleScoreSum += score;
    }
  });

  // 計算各產業的男女比例和平均滿意度
  const result = {};

  // 遍歷所有產業
  Object.keys(industryStats).forEach((industry) => {
    // 獲取當前產業的統計數據
    const stats = industryStats[industry];
    // 計算產業內的總人數
    const total = stats.male + stats.female;

    // 計算男女比例，四捨五入為整數百分比
    const malePercentage = Math.round((stats.male / total) * 100) + "%";
    const femalePercentage = Math.round((stats.female / total) * 100) + "%";

    // 計算男女平均滿意度，四捨五入到小數點後一位
    // 如果該性別在產業中沒有人，則顯示"0分"
    const maleAvgScore = stats.male
      ? (stats.maleScoreSum / stats.male).toFixed(1) + "分"
      : "0分";
    const femaleAvgScore = stats.female
      ? (stats.femaleScoreSum / stats.female).toFixed(1) + "分"
      : "0分";

    // 將計算結果存入結果物件
    result[industry] = {
      男性比例: malePercentage,
      女性比例: femalePercentage,
      男性產業滿意度: maleAvgScore,
      女性產業滿意度: femaleAvgScore,
    };
  });

  // 返回最終結果
  return result;
}

/**
 * 主函數：獲取並分析前端工程師資料
 * @returns {Promise<Object>} 各產業的男女比例與滿意度分析結果
 */
async function getIndustryGenderAnalysis() {
  try {
    // 從伺服器獲取前端工程師資料
    const interviewers = await getInterviewers();

    // 檢查是否成功獲取到資料
    if (interviewers && interviewers.length > 0) {
      // 分析資料並返回結果
      return analyzeIndustryGenderData(interviewers);
    } else {
      // 如果沒有獲取到資料，返回空物件
      console.error("無法獲取前端工程師資料");
      return {};
    }
  } catch (error) {
    // 處理任何可能的錯誤
    console.error("分析資料時發生錯誤:", error);
    return {};
  }
}

// 直接執行分析並輸出結果
console.log("開始分析前端工程師產業與性別資料...");

getIndustryGenderAnalysis()
  .then((result) => {
    console.log("各產業的男女比例與滿意度分析結果:");
    console.log(JSON.stringify(result, null, 2)); // 格式化輸出，方便閱讀
  })
  .catch((error) => {
    console.error("分析資料時發生錯誤:", error);
  });
