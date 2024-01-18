// url: isProdEnv() ? 'https://easy4learn.com' : 'https://dev.elang.app',
// translatedKey: 'b343f4eb2e1cf0d3f0f14ce30649db2fb1e0db28',
// website: isProdEnv() ? 'https://elang.app' : 'https://elang-app-dev-zehqx.ondigitalocean.app',
// cryptedIvkey: 'nuilaRSl6ZvkBAKG',
// cryptedKey: 'Rfp07QXaQPVo5W66Cyccu8Otd3SSZnIA'

export const getTranslateFromAPI = async (
  word: string,
  from: string,
  to: string
) => {
  const url =
    "https://easy4learn.com/api/vocabulary-translate/translate-phases";
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      from: from,
      to: to,
      text: word,
    }),
  };

  const translate = fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((e) => console.log(e));

  return translate;
};