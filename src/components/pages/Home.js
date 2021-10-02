import React, { Fragment, useState, useContext } from "react";
import Loading from "../layout/Loading";
import CheckboxList from "../layout/CheckboxList";
import Places from "../places/Places";

const Home = () => {
  // const errorMessages = {};
  // const textKeywordMaxLength = 10;
  // const [originAddress, setAddress] = useState("");
  // const [originGeocode, setGeocode] = useState({});
  // const [textKeyword, setTextKeyword] = useState("");
  // const [textKeywords, setTextKeywords] = useState([]);
  // const [searchKeywords, setSearchKeywords] = useState([]);
  // const [radius, setRadius] = useState("3000");
  // const [checkboxes, setCheckboxes] = useState({});
  // const [errors, setErrors] = useState({});
  // const handleCheckboxChange = (e) => {
  //   const targetValue = e.target.value;
  //   const { name, checked } = e.target;
  //   const searchKeywordIndex = searchKeywords.indexOf(targetValue);
  //   if (checked && searchKeywordIndex === -1) {
  //     setSearchKeywords([...searchKeywords, targetValue]);
  //   }
  //   if (!checked && searchKeywordIndex > -1) {
  //     searchKeywords.splice(searchKeywordIndex, 1);
  //     setSearchKeywords([...searchKeywords]);
  //   }
  //   setCheckboxes({ ...checkboxes, [name]: checked });
  // };
  // const addKeyword = (e) => {
  //   if (e.key !== "Enter") return;
  //   if (textKeywords.length + 1 > textKeywordMaxLength) {
  //     setErrors({
  //       ...errors,
  //       keyword: `一度に入力できるのは${textKeywordMaxLength}個までです`,
  //     });
  //     return;
  //   }
  //   const targetValue = e.target.value;
  //   if (textKeywords.indexOf(targetValue) > -1) {
  //     setErrors({
  //       ...errors,
  //       keyword: `${targetValue}はすでに入力済みです`,
  //     });
  //     return;
  //   }
  //   setSearchKeywords([...searchKeywords, textKeyword]);
  //   setTextKeywords([...textKeywords, textKeyword]);
  //   setTextKeyword("");
  // };
  // const removeKeyword = (keyword) => {
  //   const searchKeywordIndex = searchKeywords.indexOf(keyword);
  //   if (searchKeywordIndex === -1) return;
  //   searchKeywords.splice(searchKeywordIndex, 1);
  //   setSearchKeywords([...searchKeywords]);
  //   const textKeywordsIndex = textKeywords.indexOf(keyword);
  //   if (textKeywordsIndex === -1) return;
  //   textKeywords.splice(textKeywordsIndex, 1);
  //   setTextKeywords([...textKeywords]);
  // };
  // const setValidationMessages = () => {
  //   if (!originAddress)
  //     errorMessages["originAddress"] = "基準地点を入力してください";
  //   if (searchKeywords.length === 0)
  //     errorMessages["keyword"] = "検索する施設を選択または入力してください";
  //   if (!radius) {
  //     errorMessages["radius"] = "検索したい半径距離を入力してください";
  //   } else if (radius > 3000) {
  //     errorMessages["radius"] = "半径5000mより大きな値は指定できません";
  //   } else if (radius && radius < 50) {
  //     errorMessages["radius"] = "半径50m未満は指定できません";
  //   }
  //   // setErrors(errorMessages);
  // };
  // // 検索ボタンを押した時の処理;
  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   // setLoading(true);
  //   // setErrors({});
  //   setValidationMessages();
  //   if (textKeywords.length > textKeywordMaxLength) {
  //     alert(`自由入力は最大${textKeywordMaxLength}個までです`);
  //     return;
  //   }
  //   const errorExists = Object.keys(errorMessages).length !== 0;
  //   if (errorExists) return;
  //   const geocode = await getOriginGeocode();
  //   setGeocode(geocode);
  //   const searchRadius = radius.replace(",", "");
  //   if (searchRadius.match(/\D+/)) {
  //     // setErrors({ ...errors, radius: "半角数字で入力してください" });
  //     return;
  //   }
  //   let i = 0;
  //   const len = searchKeywords.length;
  //   const searchKeywordPlaces = () => {
  //     getNearbyPlaces(geocode, searchKeywords[i], searchRadius);
  //     i++;
  //     if (i < len) {
  //       setTimeout(() => searchKeywordPlaces(), 1000);
  //     } else {
  //       // setLoading(false);
  //       window.scrollTo(0, 0);
  //     }
  //   };
  //   searchKeywordPlaces();
  // };
  // return places.length > 0 ? (
  //   <Fragment>
  //     <p className="search-results__origin-text">
  //       「{originAddress}」から半径
  //       {radius || process.env.REACT_APP_DEFAULT_SEARCH_RADIUS}
  //       m以内の検索結果
  //     </p>
  //     {loading ? (
  //       <Loading />
  //     ) : (
  //       <Fragment>
  //         <div className="search-results__back-box">
  //           <p className="search-results__back-link" onClick={clearPlaces}>
  //             トップへ戻る
  //           </p>
  //         </div>
  //         <Places places={places} />
  //         <button className="btn-back" onClick={clearPlaces}>
  //           トップへ戻る
  //         </button>
  //       </Fragment>
  //     )}
  //   </Fragment>
  // ) : (
  //   <form onSubmit={handleSearch}>
  //     <div className="search-step__item input-row">
  //       <span className="search-step__num">STEP1</span>
  //       <p className="search-step__ttl">調べたい住所を入力</p>
  //       <input
  //         className="search-step__input input-origin"
  //         type="text"
  //         onChange={(e) => setAddress(e.target.value)}
  //         value={originAddress}
  //       />
  //       {/* <ErrorText message={errors.originAddress} /> */}
  //     </div>
  //     <div className="search-step__item input-row">
  //       <span className="search-step__num">STEP2</span>
  //       <p className="search-step__ttl">検索したい施設を選ぶ</p>
  //       <p className="search-step__sub-ttl">選択肢から選ぶ</p>
  //       <CheckboxList checkboxes={checkboxes} onChange={handleCheckboxChange} />
  //       <p className="search-step__sub-ttl">
  //         自由に入力する (最大{textKeywordMaxLength}個)
  //       </p>
  //       <input
  //         type="text"
  //         className="search-step__input input-keyword"
  //         placeholder="入力してEnterを押してください  例) セブンイレブン"
  //         onChange={(e) => setTextKeyword(e.target.value)}
  //         onKeyPress={addKeyword}
  //         value={textKeyword}
  //       />
  //       {/* <ErrorText message={errors.keyword} /> */}
  //       <ul className="textKeyword-list">
  //         {textKeywords.map((keyword, i) => (
  //           <li key={i} className="textKeyword-item">
  //             {keyword}{" "}
  //             <span
  //               className="textKeyword-close-btn"
  //               onClick={() => removeKeyword(keyword)}
  //             >
  //               ×
  //             </span>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <div className="search-step__item input-row">
  //       <span className="search-step__num">STEP3</span>
  //       <p className="search-step__ttl">検索する半径距離</p>
  //       <input
  //         type="text"
  //         className="search-step__input input-radius"
  //         onChange={(e) => setRadius(e.target.value)}
  //         value={radius}
  //       />
  //       <span className="search-step__unit">m</span>
  //       <span className="search-step__range">(50 ~ 3,000m)</span>
  //       {/* <ErrorText message={errors.radius} /> */}
  //     </div>
  //     <input type="submit" value="検索する" className="btn-search" />
  //   </form>
  // );

  return <Places />;
};

export default Home;
