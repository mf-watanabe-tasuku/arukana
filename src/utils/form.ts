import { FormatDistanceWithUnit } from "../types";

/**
 * 距離を表示用にフォーマットする関数
 * @param {number} distance - 距離
 * @return {string} distanceWithUnit - 距離と単位を結合した文字列
 */
const formatDistanceWithUnit: FormatDistanceWithUnit = distance => {
  if (!distance) return;

  let distanceWithUnit = String(distance);

  if (distance >= 1000) {
    distanceWithUnit = (distance / 1000).toFixed(1) + 'km';
  } else {
    distanceWithUnit += 'm';
  }

  return distanceWithUnit;
};


export { formatDistanceWithUnit };
