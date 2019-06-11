export default [  
  {
    path: '/login',
    name: 'login',
    component: function (resolve) {
      require(['./views/login.vue'], resolve)
    },
  },
  {
    path: '/',
    name: 'index',
    component: function (resolve) {
      require(['./views/index.vue'], resolve)
    },
    children: [
      // {
      //   path: '/',
      //   name: 'xs_ordergl',
      //   meta: {
      //     father: '销售管理',
      //     name: '订单管理',
      //   },
      //   component: function (resolve) {
      //     require(['./views/xs_ordergl.vue'], resolve)
      //   }
      // },
      {
        path: '/',
        name: 'customerManager',
        meta: {
          father: '溯源管理',
          name: '备案用户管理',
        },
        component: function (resolve) {
          require(['./views/customerManager.vue'], resolve)
        }
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          father: '用户管理',
          name: '用户管理',
        },
        component: function (resolve) {
          require(['./views/user.vue'], resolve)
        }
      },
      {
        path: '/user_role',
        name: 'userRole',
        meta: {
          father: '用户管理',
          name: '角色管理',
        },
        component: function (resolve) {
          require(['./views/userRole.vue'], resolve)
        }
      },
      {
        path: '/channel',
        name: 'channel',
        meta: {
          father: '基本信息',
          name: '渠道管理',
        },
        component: function (resolve) {
          require(['./views/channel.vue'], resolve)
        }
      },
      {
        path: '/pro_category',
        name: 'proCategory',
        meta: {
          father: '商品目录',
          name: '分类管理',
        },
        component: function (resolve) {
          require(['./views/proCategory.vue'], resolve)
        }
      },
      {
        path: '/pro_product',
        name: 'proProduct',
        meta: {
          father: '商品目录',
          name: '商品管理',
        },
        component: function (resolve) {
          require(['./views/proProduct.vue'], resolve)
        }
      },
      {
        path: '/zt_records',
        name: 'zt_records',
        meta: {
          father: '溯源数据',
          name: '主体备案',
        },
        component: function (resolve) {
          require(['./views/zt_records.vue'], resolve)
        }
      },
      {
        path: '/platformInformation',
        name: 'platformInformation',
        meta: {
          father: '基本信息',
          name: '平台消息管理',
        },
        component: function (resolve) {
          require(['./views/jb_platformInformation.vue'], resolve)
        }
      },
      {
        path: '/platform',
        name: 'platform',
        meta: {
          father: '基本信息',
          name: '平台消息查看',
        },
        component: function (resolve) {
          require(['./views/jb_platform.vue'], resolve)
        }
      },
{
        path: '/sms_notice',
        name: 'sms_notice',
        meta: {
          father: '基本信息',
          name: '短信通知',
        },
        component: function (resolve) {
          require(['./views/jb_ms_notice.vue'], resolve)
        }
      },
       {
        path: '/sms_batch',
        name: 'sms_batch',
        meta: {
          father: '基本信息',
          name: '短信批量通知',
        },
        component: function (resolve) {
          require(['./views/jb_ms_batch.vue'], resolve)
        }
      },
      {
        path: '/sms_template',
        name: 'sms_template',
        meta: {
          father: '基本信息',
          name: '短信模板',
        },
        component: function (resolve) {
          require(['./views/jb_ms_template.vue'], resolve)
        }
      },
      {
        path: '/xs_ordergl',
        name: 'xs_ordergl',
        meta: {
          father: '销售管理',
          name: '订单管理',
        },
        component: function (resolve) {
          require(['./views/xs_ordergl.vue'], resolve)
        }
      },
      {
        path: '/deviceManager',
	      name: 'deviceManager',
	      meta: {
	        father: '基本信息',
	        name: '设备管理',
	      },
	      component: function (resolve) {
	        require(['./views/deviceManager.vue'], resolve)
	      }
	    },{
        path: '/deviceVersionManager',
	      name: 'deviceVersionManager',
	      meta: {
	        father: '基本信息',
	        name: '系统版本管理',
	      },
	      component: function (resolve) {
	        require(['./views/deviceVersionManager.vue'], resolve)
	      }
	    },
	    {
        path: '/bonusRulesManager',
        name: 'bonusRulesManager',
        meta: {
          father: '基本信息',
          name: '奖金规则管理',
        },
        component: function (resolve) {
          require(['./views/bonusRulesManager.vue'], resolve)
        }
      },
	    {
        path: '/marketMain',
	      name: 'marketMain',
	      meta: {
	        father: '溯源管理',
	        name: '市场管理',
					modal:1
	      },
	      component: function (resolve) {
	        require(['./views/marketMain.vue'], resolve)
	      }
	    },
	    {
        path: '/customerManager',
	      name: 'customerManager',
	      meta: {
	        father: '溯源管理',
	        name: '备案用户管理',
	      },
	      component: function (resolve) {
	        require(['./views/customerManager.vue'], resolve)
	      }
	    },
	    {
        path: '/detectionManager',
	      name: 'detectionManager',
	      meta: {
	        father: '溯源管理',
	        name: '检验检疫管理',
	      },
	      component: function (resolve) {
	        require(['./views/detectionManager.vue'], resolve)
	      }
	    },
	    {
        path: '/reviewManager',
	      name: 'reviewManager',
	      meta: {
	        father: '信誉系统',
	        name: '评价管理',
	      },
	      component: function (resolve) {
	        require(['./views/reviewManager.vue'], resolve)
	      }
	    },
	     {
        path: '/gradeManager',
	      name: 'gradeManager',
	      meta: {
	        father: '信誉系统',
	        name: '评级管理',
	      },
	      component: function (resolve) {
	        require(['./views/gradeManager.vue'], resolve)
	      }
	    },
	    {
        path: '/reputationManager',
	      name: 'reputationManager',
	      meta: {
	        father: '信誉系统',
	        name: '信誉管理',
	      },
	      component: function (resolve) {
	        require(['./views/reputationManager.vue'], resolve)
	      }
	    },{
        path: '/inMarketDetail',
        name: 'inMarketDetail',
        meta: {
          father: '溯源管理',
          name: '来溯管理',
        },
        component: function (resolve) {
          require(['./views/inMarketDetail.vue'], resolve)
        }
      },
      {
        path: '/data_xiaofei',
        name: 'xiaofei',
        meta: {
          father: '统计报表',
          name: '消费结构',
        },
        component: function (resolve) {
          require(['./views/xiaofei.vue'], resolve)
        }
      },
      {
        path: '/data_laiyuan',
        name: 'laiyuan',
        meta: {
          father: '统计报表',
          name: '来源分析',
        },
        component: function (resolve) {
          require(['./views/laiyuan.vue'], resolve)
        }
      },
       {
        path: '/B_liuxiang',
        name: 'liuxiang',
        meta: {
          father: '统计报表',
          name: '流向分析',
        },
        component: function (resolve) {
          require(['./views/liuxiang.vue'], resolve)
        }
      },
      {
        path: '/data_orders',
        name: 'orders',
        meta: {
          father: '统计报表',
          name: '订单统计',
        },
        component: function (resolve) {
          require(['./views/orders_received.vue'], resolve)
        }
      },
      {
        path: '/orderStatistics',
        name: 'orderStatistics',
        meta: {
            father: '统计报表',
            name:'订单已分拣详情统计',
            modal:1
        },
        component: function (resolve) {
            require(['./views/orderStatistics.vue'],resolve)
        }
    	},
      {
        path: '/data_varietyPrice',
        name: 'varietyPrice',
        meta: {
          father: '统计报表',
          name: '品种量价',
        },
        component: function (resolve) {
          require(['./views/varietyPriceStatement.vue'], resolve)
        }
      },
      {
        path: '/data_saleAnalysis',
        name: 'saleAnalysis',
        meta: {
            father: '统计报表',
            name: '销售统计',
        },
        component: function (resolve) {
            require(['./views/saleAnalysis.vue'], resolve)
        }
      },
       {
        path: '/knowledgebase',
        name: 'knowledgebase',
        meta: {
          father: '客服系统',
          name: '知识库',
        },
        component: function (resolve) {
          require(['./views/kf_KnowledgebaseManagement.vue'], resolve)
        }
      },
       {
        path: '/merchantStatistics',
        name: 'merchantStatistics',
        meta: {
          father: '统计报表',
          name: '商户统计汇总',
        },
        component: function (resolve) {
          require(['./views/merchantStatistics.vue'], resolve)
        }
      },
      {
        path: '/billManage',
        name: 'billManage', 
        meta: {
          father: '电子结算信息',
          name: '账单管理',
        },
        component: function (resolve) {
          require(['./views/js_billManage.vue'], resolve)
        }
      },
      {
        path: '/clearWater',
        name: 'clearWater', 
        meta: {
          father: '电子结算信息',
          name: '清分流水',
        },
        component: function (resolve) {
          require(['./views/js_clearWater.vue'], resolve)
        }
      },
      {
        path: '/settleMessage',
        name: 'settleMessage', 
        meta: {
          father: '电子结算信息',
          name: '结算信息',
        },
        component: function (resolve) {
          require(['./views/js_settleMessage.vue'], resolve)
        }
      },
      {
        path: '/accountingWater',
        name: 'accountingWater', 
        meta: {
          father: '电子结算信息',
          name: '账务流水',
        },
        component: function (resolve) {
          require(['./views/js_accountingWater.vue'], resolve)
        }
      },
      {
        path: '/accountInfo',
        name: 'accountInfo', 
        meta: {
          father: '电子结算信息',
          name: '账户信息',	
        },
        component: function (resolve) {
          require(['./views/js_accountInfo.vue'], resolve)
        }
      },
      {
        path: '/dailyBalance',
        name: 'dailyBalance', 
        meta: {
          father: '电子结算信息',
          name: '每日余额',	
        },
        component: function (resolve) {
          require(['./views/js_dailyBalance.vue'], resolve)
        }
      },
      {
        path: '/channelTrade',
        name: 'channelTrade', 
        meta: {
          father: '电子结算信息',
          name: '渠道流水',	
        },
        component: function (resolve) {
          require(['./views/js_channelTrade.vue'], resolve)
        }
      },
      {
        path: '/billTypeConf',
        name: 'billTypeConf', 
        meta: {
          father: '电子结算信息',
          name: '账单类型配置',	
        },
        component: function (resolve) {
          require(['./views/js_billTypeConf.vue'], resolve)
        }
      },
      {
        path: '/clearPlaceConf',
        name: 'clearPlaceConf', 
        meta: {
          father: '电子结算信息',
          name: '清算场次配置',	
        },
        component: function (resolve) {
          require(['./views/js_clearPlaceConf.vue'], resolve)
        }
      },
      {
        path: '/channelRouteConf',
        name: 'channelRouteConf', 
        meta: {
          father: '电子结算信息',
          name: '渠道路由配置',	
        },
        component: function (resolve) {
          require(['./views/js_channelRouteConf.vue'], resolve)
        }
      },
      {
        path: '/clearBatch',
        name: 'clearBatch',
        meta: {
          father: '电子结算信息',
          name: '清算批次',
        },
        component: function (resolve) {
          require(['./views/js_clearBatch.vue'], resolve)
        }
      },
       {
        path: '/buyerStatistics',
        name: 'buyerStatistics',
        meta: {
            father: '统计报表',
            name: '采购商购买统计',
            modal:1
        },
        component: function (resolve) {
            require(['./views/buyerStatistics.vue'], resolve)
        }
      },
       {
        path: '/sellerStatistics',
        name: 'sellerStatistics',
        meta: {
            father: '统计报表',
            name: '供应商销售统计',
            modal:1
        },
        component: function (resolve) {
            require(['./views/sellerStatistics.vue'], resolve)
        }
      },
       {
        path: '/merchantManager',
        name: 'merchantManager',
        meta: {
            father: '溯源管理',
            name: '城市平台下载用户',
            modal:1
        },
        component: function (resolve) {
            require(['./views/merchantManager.vue'], resolve)
        }
      },
      {
        path: '/advertisementManager',
        name: 'advertisementManager',
        meta: {
          father: '基本信息',
          name: '广告管理',
          modal:1
        },
        component: function (resolve) {
          require(['./views/advertisementManager.vue'], resolve)
        }
      },
      {
        path: '/advertisementPositionManager',
        name: 'advertisementPositionManager',
        meta: {
          father: '基本信息',
          name: '广告位管理',
          modal:1
        },
        component: function (resolve) {
          require(['./views/advertisementPositionManager.vue'], resolve)
        }
      },
    ]
  }
]
