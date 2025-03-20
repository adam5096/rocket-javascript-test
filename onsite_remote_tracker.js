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

// 這個函數用來計算每個產業有多少實體辦公室、遠端工作和混合制的公司
export const countIndustryWorkplaceTypes = (data) => {
  // 準備一個空的結果箱子，用來裝所有產業的統計數據
  const result = {};

  // 對每一個人的資料進行檢查 (就像一個一個查看調查表)
  data.forEach(record => {
    // 從調查表中找出這個人的產業和工作方式
    const industry = record.company.industry;     // 例如: "教育產業"
    const workplaceType = record.company.work;    // 例如: "實體辦公室"

    // 如果這是我們第一次看到這個產業，就給它一個新的計數器
    // (好比是第一次看到"教育產業"，就拿出一張新紙準備記錄)
    if (!result[industry]) {
      result[industry] = {
        "實體辦公室": 0,  // 實體辦公室的數量從0開始
        "遠端工作": 0,    // 遠端工作的數量從0開始
        "混合制": 0       // 混合制的數量從0開始
      };
    }

    // 找到對應的產業和工作方式，計數加1
    // (就像在該產業的工作方式那一欄打一個勾)
    result[industry][workplaceType]++;
  });

  // 把所有數字轉成"X間"的格式，讓結果更好看
  // 先找出所有的產業
  Object.keys(result).forEach(industry => {
    // 對於每個產業，找出它所有的工作方式
    const industryData = result[industry];
    // 把每種工作方式的數字後面加上"間"字
    Object.keys(industryData).forEach(type => {
      industryData[type] = `${industryData[type]}間`;  // 例如: 把 5 變成 "5間"
    });
  });

  // 把最終的結果交出去
  return result;
};

// 主函數：從網路獲取數據，然後進行統計
export const getIndustryWorkplaceStats = async () => {
  try {
    // 從網路上獲取所有人的資料
    const data = await getInterviewers();
    
    // 用我們的計數函數來計算統計結果
    return countIndustryWorkplaceTypes(data);
  } catch (error) {
    // 如果過程中出了問題，記錄錯誤並返回空結果
    console.error("處理資料時發生錯誤:", error);
    return {};
  }
};

// 使用範例：
const stats = await getIndustryWorkplaceStats();
console.log(JSON.stringify(stats, null, 2));
