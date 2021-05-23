/**
 * 目前实现的软体业务归总
 * 每日类:
 *  每日签到积分
 *  冬奥积分活动 20201231
 *  每日定向积分 20201231
 *  每日游戏楼层宝箱
 *  每日抽奖
 *  每日评论积分
 *  首页-游戏-娱乐中心-沃之树
 *  首页-小说-阅读越有礼打卡赢话费
 *  首页-小说-读满10章赢好礼
 *  首页-小说-阅读福利抽大奖
 *  首页-小说-任意一本小说内页章节中间 [看书里面的5个视频]
 *  首页-签到有礼-免费领-浏览领积分
 *  首页-签到有礼-免费领-猜拳拿话费
 *  首页-签到有礼-免费拿-看视频夺宝
 *  首页-签到有礼-免费抽-抓OPPO手机
 *  首页-签到有礼-免费抽-拿666积分-豪礼大派送抽奖
 *  首页-签到有礼-免费抽-拿苹果iPad Pro(摇一摇)
 *  首页-签到有礼-免费抽-拆华为Pad(去抽奖)
 *  首页-签到有礼-免费抽-拿iPhone12(摇一摇)
 *  首页-签到有礼-免费抽-赢Apple Watch(去抽奖) [活动取消]
 *  首页-签到有礼-免费抽-华为mate40pro(刮刮乐)
 *  首页-签到有礼-赢vivo X60(翻牛牌)
 *  首页-签到有礼-赚更多福利-看视频奖励5积分
 *  首页-签到有礼-赚更多福利-天天抽好礼
 *  首页-签到有礼-居家娱乐馆
 *  首页-签到有礼-免费抽霸王餐
 *  首页-签到有礼-聚宝盆 [广告图]
 *  首页-游戏-娱乐中心-每日打卡
 *  首页-游戏-娱乐中心-天天领取3G流量包
 *  首页-游戏-娱乐中心-每日打卡-完成今日任务(200m)
 *  首页-积分查询-游戏任务
 *  首页-知识-限时免费（连续7天阶梯激励）
 *  首页-积分商城-10分精彩看视频得积分-三只松鼠 [支付页]
 * 节日类
 *  首页-牛气-秒杀抢兑
 *  首页-牛气-转盘抽奖
 *  首页-牛气-场馆领牛气
 *
 *
 *
 */
const { scheduler } = require("../../../utils/scheduler");

var start = async (params) => {
  const { cookies, options } = params;

  let init = async (request, savedCookies) => {
    await require("./init")(request, {
      ...params,
      cookies: savedCookies || cookies,
    });
    return {
      request,
    };
  };
  let taskOption = {
    init,
  };

  // 每日签到积分
  await scheduler.regTask(
    "dailysignin",
    async (request) => {
      await require("./dailysignin").doTask(request, options);
      await require("./integral").addFlow(request, options);
    },
    taskOption
  );

  // 冬奥积分活动 20201231
  await scheduler.regTask(
    "winterTwo",
    async (request) => {
      await require("./integral").winterTwoGetIntegral(request, options);
      await require("./integral").winterTwoStatus(request, options);
    },
    taskOption
  );

  // 每日定向积分 20201231
  await scheduler.regTask(
    "dxIntegralEveryDay",
    async (request) => {
      await require("./integral").dxIntegralEveryDay(request, options);
    },
    taskOption
  );

  // 每日游戏楼层宝箱
  await scheduler.regTask(
    "dailygamebox",
    async (request) => {
      await require("./integral").gamebox(request, options);
    },
    taskOption
  );

  // 每日抽奖
  await scheduler.regTask(
    "dailylotteryintegral",
    async (request) => {
      await require("./dailylotteryintegral").doTask(request, options);
    },
    taskOption
  );

  // 每日评论积分
  await scheduler.regTask(
    "dailycomment",
    async (request) => {
      await require("./commentSystem")
        .commentTask(request, options)
        .catch(console.log);
    },
    taskOption
  );

  // 首页-游戏-娱乐中心-沃之树
  await scheduler.regTask(
    "dailywoTree",
    async (request) => {
      await require("./woTree").doTask(request, options);
    },
    taskOption
  );

  //FIXME 首页-小说-阅读越有礼打卡赢话费
  // await scheduler.regTask(
  //   "dailyBookRead",
  //   async (request) => {
  //     await require("./dailyBookRead").doTask(request, options);
  //     await require("./dailyVideoBook").doTask(request, options);
  //   },
  //   taskOption
  // );

  // 首页-小说-读满10章赢好礼
  await scheduler.regTask(
    "dailyBookRead10doDraw",
    async (request) => {
      // 首页-小说-读满10章赢好礼
      await require("./dailyVideoBook").read10doDraw(request, options);
      // 首页-小说-读满10章赢好礼-看视频领2积分
      await require("./dailyVideoBook").read10doDrawLookVideoDouble(
        request,
        options
      );
      // 首页-签到有礼-免流量得福利-3积分天天拿(阅读打卡)
      await require("./dailyVideoBook").giftBoints(request, options);
    },
    taskOption
  );

  // 首页-小说-阅读福利抽大奖
  await scheduler.regTask(
    "dailyBookLuckdraw",
    async (request) => {
      await require("./dailyBookLuckdraw").doTask(request, options);
    },
    taskOption
  );

  // 首页-签到有礼-免费领-浏览领积分
  await scheduler.regTask(
    "dailyLiuLan",
    async (request) => {
      await require("./dailyTTliulan").doTask(request, options);
    },
    taskOption
  );

  // 首页-签到有礼-免费拿-看视频夺宝
  // FIXME:易出现本次操作需要进行验证，暂时注释
  // await scheduler.regTask(
  //   "dailyVideoFreeGoods",
  //   async (request) => {
  //     await require("./dailyVideoFreeGoods").doTask(request, options);
  //   },
  //   {
  //     isCircle: true,
  //     startTime: 10 * 3600,
  //     intervalTime: 4 * 3600,
  //   }
  // );

  // FIXME: 首页-签到有礼-免费抽-抓OPPO手机
  // await scheduler.regTask(
  //   "dailyGrabdollPage",
  //   async (request) => {
  //     await require("./dailyGrabdollPage").doTask(request, options);
  //   },
  //   taskOption
  // );

  // FIXME: 首页-签到有礼-免费抽-拿666积分-豪礼大派送抽奖
  // await scheduler.regTask(
  //   "jflottery",
  //   async (request) => {
  //     await require("./jflottery").doTask(request, options);
  //   },
  //   taskOption
  // );

  // 666积分补全。。。。
  await scheduler.regTask(
    "jflotteryad",
    async (request) => {
      await require("./jflotteryad.js").doTask(request, options);
    },
    taskOption
  );

  // FIXME: 首页-签到有礼-免费抽-拿苹果iPad Pro(摇一摇)
  // await scheduler.regTask(
  //   "dailyYYY",
  //   async (request) => {
  //     await require("./dailyYYY").doTask(request, options);
  //   },
  //   taskOption
  // );

  // 首页-签到有礼-免费抽-华为mate40pro(刮刮乐)
  await scheduler.regTask(
    "dailyVideoScratchcard",
    async (request) => {
      await require("./dailyVideoScratchcard").doTask(request, options);
    },
    taskOption
  );

  // 首页-签到有礼-免费抽-拆华为Pad(去抽奖)
  await scheduler.regTask(
    "dailyLKMH",
    async (request) => {
      await require("./dailyLKMH").doTask(request, options);
    },
    taskOption
  );

  // 首页-签到有礼-免费抽-拿iPhone12(摇一摇)
  await scheduler.regTask(
    "dailyYYQ",
    async (request) => {
      await require("./dailyYYQ").doTask(request, options);
    },
    taskOption
  );

  // FIXME: 首页-签到有礼-赢vivo X60(翻牛牌)
  // 非法请求
  // await scheduler.regTask(
  //   "bcow",
  //   async (request) => {
  //     await require("./dailyBcow").doTask(request, options);
  //   },
  //   taskOption
  // );

  // FIXME: 首页-签到有礼-赚更多福利-看视频奖励5积分
  // 网络拥堵
  // await scheduler.regTask(
  //   "dailyVideo",
  //   async (request) => {
  //     await require("./dailyVideo").doTask(request, options);
  //   },
  //   taskOption
  // );

  // 首页-签到有礼-赚更多福利-天天抽好礼
  await scheduler.regTask(
    "dailylottery",
    async (request) => {
      await require("./dailylottery").doTask(request, options);
    },
    taskOption
  );

  // 首页-游戏-娱乐中心-每日打卡
  await scheduler.regTask(
    "producGameSignin",
    async (request) => {
      await require("./producGame").gameSignin(request, options);
      await require("./producGame").gameBox(request, options);
    },
    taskOption
  );

  // 首页-游戏-娱乐中心-天天领取3G流量包
  await scheduler.regTask(
    "dailygameflow",
    async (request) => {
      // eslint-disable-next-line
      await require("./producGame").doGameFlowTask(request, { ...options, deviceType: "Android" });
      // eslint-disable-next-line
      await require("./producGame").doGameFlowTask(request, { ...options, deviceType: "iOS" });
    },
    {
      ...taskOption,
      endHours: 12, // must execute before 12:00
    }
  );

  // 首页-游戏-娱乐中心-天天领取3G流量包-获取流量包
  await scheduler.regTask(
    "dailygameflowget",
    async (request) => {
      // eslint-disable-next-line
      await require("./producGame").doGameFlowGet(request, { ...options, deviceType: "Android" });
      // eslint-disable-next-line
      await require("./producGame").doGameFlowGet(request, { ...options, deviceType: "iOS" });
    },
    {
      ...taskOption,
      startHours: 16, // must execute after 16:00
    }
  );

  // 首页-积分查询-游戏任务
  await scheduler.regTask(
    "dailygameIntegral",
    async (request) => {
      // eslint-disable-next-line
      await require("./producGame").doGameIntegralTask(request, { ...options, deviceType: "Android" });
      // eslint-disable-next-line
      await require("./producGame").doGameIntegralTask(request, { ...options, deviceType: "iOS" });
    },
    taskOption
  );

  // 首页-游戏-娱乐中心-每日打卡-完成今日任务
  await scheduler.regTask(
    "todayDailyTask",
    async (request) => {
      await require("./producGame").doTodayDailyTask(request, options);
    },
    {
      ...taskOption,
      startTime: 20 * 3600,
      endHours: 12,
    }
  );

  // 首页-游戏-娱乐中心-每日打卡-完成今日任务(200m)
  await scheduler.regTask(
    "todayDailyTaskGet",
    async (request) => {
      await require("./producGame").doTodayDailyTaskGet(request, options);
    },
    {
      ...taskOption,
      startHours: 16,
    }
  );

  // 首页-知识-限时免费（连续7天阶梯激励）
  await scheduler.regTask(
    "dailyCourse",
    async (request) => {
      await require("./dailyCourse").doTask(request, options);
    },
    {
      ...taskOption,
      startTime: 9 * 3600,
    }
  );

  // FIXME: 首页-积分商城-10分精彩看视频得积分-三只松鼠 [支付页]
  // 网络拥堵
  // await scheduler.regTask(
  //   "threeSquirrels",
  //   async (request) => {
  //     await require("./dailyThreeSquirrels.js").doTask(request, options);
  //   },
  //   taskOption
  // );

  // 首页-下载app
  await scheduler.regTask(
    "freeDownFloorAd",
    async (request) => {
      await require("./freeDownFloorAd.js").doTask(request, options);
    },
    taskOption
  );

  // 首页-签到有礼-免费抽霸王餐
  await scheduler.regTask(
    "dailyBaWangcard",
    async (request) => {
      await require("./dailyBaWangcard.js").doTask(request, options);
    },
    taskOption
  );

  // 首页-小说-任意一本小说内页章节中间 [看书里面的5个视频]
  // 网络拥堵
  await scheduler.regTask(
    "book5video",
    async (request) => {
      await require("./book5video.js").doTask(request, options);
    },
    taskOption
  );

  // 首页-签到有礼-免费领-猜拳拿话费
  // 非法请求
  await scheduler.regTask(
    "dailyFingerqd",
    async (request) => {
      await require("./dailyFingerqd.js").doTask(request, options);
    },
    taskOption
  );

  // 积分商城-积分猜拳-猜拳二号
  await scheduler.regTask(
    "dailyFingerqd2",
    async (request) => {
      await require("./dailyFingerqd2.js").doTask(request, options);
    },
    taskOption
  );

  // FIXME: 套餐看视频得积分
  // 活动入口：主页-套餐页面-2个视频
  // 前方网络拥堵
  await scheduler.regTask(
    "taocan",
    async (request) => {
      await require("./taocan.js").doTask(request, options);
    },
    taskOption
  );

  // FIXME: 首页-签到有礼-饿了么红包
  // 非法请求
  await scheduler.regTask(
    "dailyTurncards",
    async (request) => {
      await require("./dailyTurncards.js").doTask(request, options);
    },
    taskOption
  );

  // 积分查询
  await scheduler.regTask(
    "fetchCoins",
    async (request) => {
      await require("./fetchCoins.js").doTask(request, options);
    },
    {
      ...taskOption,
      ...taskOption,
      startTime: 21 * 3600,
      ignoreRelay: true,
    }
  );
};
module.exports = {
  start,
};
