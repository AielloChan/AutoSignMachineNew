var crypto = require("crypto");
var moment = require("moment");

// 首页-签到有礼-免费抽-赢三星Galaxy Z(试试手气)
var transParams = (data) => {
  let params = new URLSearchParams();
  for (let item in data) {
    params.append(item, data["" + item + ""]);
  }
  return params;
};
function w() {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
    t = [];
  return (
    Object.keys(e).forEach(function (a) {
      t.push("".concat(a, "=").concat(encodeURIComponent(e[a])));
    }),
    t.join("&")
  );
}
var sign = (data) => {
  let str = "integralofficial&";
  let params = [];
  data.forEach((v, i) => {
    if (v) {
      params.push("arguments" + (i + 1) + v);
    }
  });
  return crypto
    .createHash("md5")
    .update(str + params.join("&"))
    .digest("hex");
};

function encryption(data, key) {
  var iv = "";
  var cipherEncoding = "base64";
  var cipher = crypto.createCipheriv("aes-128-ecb", key, iv);
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString(
    cipherEncoding
  );
}

var dailyCheapStorePage = {
  getGoodsList: async (axios, options) => {
    let phone = encryption(options.user, "gb6YCccUvth75Tm2");
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}    `;
    let result = await axios.request({
      headers: {
        "user-agent": useragent,
        referer: `https://wxapp.msmds.cn/`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/api/change/collect/chip/gift/v1/home/info`,
      method: "POST",
      data: transParams({
        channelId: "LT_channel",
        phone: phone,
        token: options.ecs_token,
        sourceCode: "lt_cheapStore",
      }),
    });
    result.data.data.list.forEach((g) => {
      console.log(
        "已有【" + g.giftName + "】碎片",
        `(${g.haveCount}/${g.limitCode})`
      );
    });
    return result.data.data;
  },
  doTask: async (axios, options) => {
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
    let searchParams = {};
    let result = await axios
      .request({
        baseURL: "https://m.client.10010.com/",
        headers: {
          "user-agent": useragent,
          referer: `https://img.client.10010.com/`,
          origin: "https://img.client.10010.com",
        },
        url: `https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://wxapp.msmds.cn/h5/react_web/unicom/cheapStorePage?source=unicom&duanlianjieabc=tbkEG`,
        method: "GET",
        transformResponse: (data, headers) => {
          if ("location" in headers) {
            let uu = new URL(headers.location);
            let pp = {};
            for (let p of uu.searchParams) {
              pp[p[0]] = p[1];
            }
            if ("ticket" in pp) {
              searchParams = pp;
            }
          }
          return data;
        },
      })
      .catch((err) => console.log(err));
    let jar1 = result.config.jar;

    let cookiesJson = jar1.toJSON();
    let ecs_token = cookiesJson.cookies.find((i) => i.key == "ecs_token");
    if (!ecs_token) {
      console.log(
        "🚀 ~ file: dailyCheapStorePage.js ~ line 106 ~ doTask: ~ ecs_token",
        ecs_token,
        cookiesJson
      );
      throw new Error("ecs_token缺失");
    }
    ecs_token = ecs_token.value;

    let phone = encryption(options.user, "gb6YCccUvth75Tm2");
    let playCounts = 0;
    let bottleCount = 0;

    // 每6个小时6次机会，可使用能量瓶重置机会

    let tryn = 5;

    do {
      let res = await dailyCheapStorePage.getGoodsList(axios, {
        ...options,
        ecs_token,
        phone,
      });

      playCounts = res.playCounts;
      bottleCount = res.bottleCount;
      console.log("剩余能量瓶:", bottleCount, "剩余游戏机会:", playCounts);

      if ("times" in res) {
        console.log(
          "每6个小时6次机会",
          moment(new Date(res.times)).format("YYYY-MM-DD HH:mm:ss") +
          " 后可再次尝试"
        );
      }

      if (!playCounts) {
        // 用完机会再使用能量瓶重置
        console.log("尝试使用能量瓶重置机会");
        let bs = 1;
        if (!bottleCount) {
          bs = await dailyCheapStorePage.getBottle(axios, {
            ...options,
            jar: jar1,
            searchParams,
            ecs_token,
          });
        }
        if (bs === 2) {
          break;
        } else if (bs === 1) {
          await dailyCheapStorePage.bottleExpend(axios, {
            ...options,
            jar: jar1,
            searchParams,
            ecs_token,
          });
          playCounts = 6;
          console.log("重置机会成功+", playCounts);
        } else if (bs === 0) {
          // 防止错误循环
          tryn = tryn - 1;
          if (!tryn) {
            console.log("出现错误，重试重置机会超过5次，跳过任务");
            break;
          } else {
            console.log("出现错误，重试重置机会");
            continue;
          }
        }
      }

      let a = {
        channelId: "LT_channel",
        code: "",
        phone: phone,
        token: ecs_token,
        sourceCode: "lt_cheapStore",
      };

      let timestamp = moment().format("YYYYMMDDHHmmss");

      result = await axios.request({
        headers: {
          "user-agent": useragent,
          referer: `https://wxapp.msmds.cn/h5/react_web/unicom/cheapStorePage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbkEG&userNumber=${options.user}`,
          origin: "https://wxapp.msmds.cn",
        },
        url:
          `https://wxapp.msmds.cn/jplus/api/change/collect/chip/gift/v1/play/luck/draw?` +
          w(a),
        method: "POST",
      });

      if (result.data.code !== 200) {
        console.log("提交任务失败", result.data.msg);
        if (result.data.msg.indexOf("请勿频繁操作") !== -1) {
          throw new Error("取消本次任务");
        }
      } else {
        let data = result.data.data;
        let good = res.list.find((f) => f.giftId === data.giftId);
        console.log(
          "提交任务成功，获得",
          good.giftName,
          "累计商品碎片x" + data.fragmentCount,
          data.desc + data.playCounts
        );
      }

      if (playCounts) {
        console.log("等待15秒再继续");
        await new Promise((resolve, reject) => setTimeout(resolve, 15 * 1000));
      }
    } while (playCounts);

    console.log("进入下一轮的尝试等待期");
  },
  getBottleState: async (axios, options) => {
    const { jar, searchParams, ecs_token } = options;
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
    let phone = encryption(options.user, "gb6YCccUvth75Tm2");

    let a = {
      channelId: "LT_channel",
      phone: phone,
      isDetails: "false",
      token: ecs_token,
      sourceCode: "lt_cheapStore",
    };
    let timestamp = moment().format("YYYYMMDDHHmmss");
    result = await axios.request({
      headers: {
        "user-agent": useragent,
        referer: `https://wxapp.msmds.cn/h5/react_web/unicom/cheapStorePage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbkEG&userNumber=${options.user}`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/api/change/collect/chip/gift/v1/bottle/add`,
      method: "POST",
      data: transParams(a),
    });
    if (result.data.code !== 200) {
      console.log("查询能量瓶状态失败", result.data.msg);
    } else {
      if (result.data.data.status === 1) {
        if ("times" in result.data.data) {
          let m =
            moment(new Date(result.data.data.times)).format(
              "YYYY-MM-DD HH:mm:ss"
            ) + " 后可再次尝试";
          console.log(result.data.data.text, m);
          return false;
        }
      } else {
        return true;
      }
    }
    return false;
  },
  // 获取能量瓶 4个小时只能获取3次能量瓶的机会
  getBottle: async (axios, options) => {
    const { jar, searchParams, ecs_token } = options;
    let state = await dailyCheapStorePage.getBottleState(axios, options);
    if (!state) {
      console.log("跳过获取能量瓶");
      return 2;
    }
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
    let phone = encryption(options.user, "gb6YCccUvth75Tm2");
    // 每4小时3次, 等每轮机会用完再获取

    let params = {
      arguments1: "",
      arguments2: "",
      arguments3: "",
      arguments4: new Date().getTime(),
      arguments6: "",
      arguments7: "",
      arguments8: "",
      arguments9: "",
      netWay: "Wifi",
      remark: "签到小游戏买什么都省申请便利店抽奖",
      version: `android@8.0100`,
      codeId: 945535693,
    };
    params["sign"] = sign([
      params.arguments1,
      params.arguments2,
      params.arguments3,
      params.arguments4,
    ]);
    params["orderId"] = crypto
      .createHash("md5")
      .update(new Date().getTime() + "")
      .digest("hex");
    params["arguments4"] = new Date().getTime();

    let result = await require("./taskcallback").reward(axios, {
      ...options,
      params,
      jar,
    });

    let a = {
      channelId: "LT_channel",
      phone: phone,
      isDetails: "false",
      token: ecs_token,
      videoOrderNo: params["orderId"],
      sourceCode: "lt_cheapStore",
    };
    let timestamp = moment().format("YYYYMMDDHHmmss");
    result = await axios.request({
      headers: {
        "user-agent": useragent,
        referer: `https://wxapp.msmds.cn/h5/react_web/unicom/cheapStorePage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbkEG&userNumber=${options.user}`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/api/change/collect/chip/gift/v1/bottle/add`,
      method: "POST",
      data: transParams(a),
    });
    if (result.data.code !== 200) {
      console.log("提交任务失败", result.data.msg);
    } else {
      if (result.data.data.status === 0) {
        console.log(
          "提交任务成功",
          `获得能量瓶+${result.data.data.bottleCounts}`
        );
        return 1;
      } else {
        console.log("提交任务成功", `已无法获得能量瓶`, result.data.data.text);
        return 2;
      }
    }
    console.log("等待5秒再继续");
    await new Promise((resolve, reject) => setTimeout(resolve, 5 * 1000));

    return 0;
  },
  // 能量瓶兑换机会
  bottleExpend: async (axios, options) => {
    const { jar, searchParams, ecs_token } = options;
    const useragent = `Mozilla/5.0 (Linux; Android 7.1.2; SM-G977N Build/LMY48Z; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3770.143 Mobile Safari/537.36; unicom{version:android@8.0100,desmobile:${options.user}};devicetype{deviceBrand:samsung,deviceModel:SM-G977N};{yw_code:}`;
    let phone = encryption(options.user, "gb6YCccUvth75Tm2");
    let a = {
      channelId: "LT_channel",
      phone: phone,
      token: ecs_token,
      sourceCode: "lt_cheapStore",
    };
    let timestamp = moment().format("YYYYMMDDHHmmss");
    result = await axios.request({
      headers: {
        "user-agent": useragent,
        referer: `https://wxapp.msmds.cn/h5/react_web/unicom/cheapStorePage?source=unicom&type=02&ticket=${searchParams.ticket}&version=android@8.0100&timestamp=${timestamp}&desmobile=${options.user}&num=0&postage=${searchParams.postage}&duanlianjieabc=tbkEG&userNumber=${options.user}`,
        origin: "https://wxapp.msmds.cn",
      },
      url: `https://wxapp.msmds.cn/jplus/api/change/collect/chip/gift/v1/bottle/expend`,
      method: "POST",
      data: transParams(a),
    });

    if (result.data.code !== 200) {
      console.log("提交任务失败", result.data.msg);
    } else {
      console.log("提交任务成功", `能量瓶兑换抽奖机会成功`);
    }
  },
};

module.exports = dailyCheapStorePage;
