var cascadeList1, cascadeList2, cascadeList3, cascadeList4, cascadeList5; //级联数据
var selectFirstId, selectSecondId, selectThirdId, selectFourId, selectFiveId; //每级级联的选中ID
var countDisable; //标记一共有多少级级联（修改时解除禁用）
var terminalType = 1;  //当前选中的终端类型，用于智能标注
function logout () {
    layer.alert('您确定要退出吗？', {
        title: "确认退出",
        btn: ['确认', '取消'],
        yes: function () {
            var signOut = {
                action: 'user/logout.do',
            };
            // 提交所有id
            ajaxdata(signOut, function (result, data) {
                if (result) {
                    window.location.href = getbasePath("login.do"); //修复退出跳转
                } else {
                    layer.msg(data.msg);
                }
            });
        }
    })
}
$(function () {
    vm = new Vue({
        el: '.resmanagement',
        data: {
            // 无锡 添加预案搜索框的一级分类或者是二级分类的数据
            searchInpObj: {},
            // 无锡，显示二级菜单开关
            classfySelectFlag: false,
            // 无锡需求新增预案分类，option下拉框的值
            allClassifyOptionList: [
                { key: 0, name: '全部分类' },
                { key: 1, name: '未分类' },
            ],
            allClassifyOptionListIsChildren: [
                // {key: 0, name:'选择二级',iconFlag:true},
            ],
            //
            // 无锡需求新增预案分类，分类设置弹窗title
            classifyTitle: '分类设置',
            // 无锡需求新增预案分类，列表数据,别删除假数据，按照这个数据结构维护数据
            allClassifyListArr: [
                // {index: 0,isIcon: false, name: '测试假数据',isLabel:false, children: [
                //         {index: 0,name: '测试假数据，子集数据111'},
                //         {index: 1,name: '测试假数据，子集数据222'}
                // ]},
            ],
            // 无锡需求新增，分类名称
            classfyName: '',
            //无锡 控制添加预案的 dom节点的渲染和select的v-model
            selectClassfy: 2,
            // 无锡 编辑分类后的每一条数据
            editClassfyItem: {},
            classfyIsShowDom: true,
            // 无锡，编辑分类弹窗
            editDialogClassfy: null,
            // 二级下拉框的开关
            classfySelectFlag: false,
            // 预案分类一级下拉框的v-model
            planClassificationVal: 0,
            timer: null,//计时器
            processFlag: false,//进度条显隐
            percentage: 0,//进度条
            //上传失败的数据表
            errorData: {
                detail: '',//错误详情
                fileName: '',//错误文件
                errorFlag: false,//提示框开关
                errorMsg: '',//提示语
            },
            importFlag: false,//批量导入弹出框显隐
            fileList: [],//上传文件列表
            firstLabelFlag: false, // 关联标签显示下拉框
            devicesFlag: 0, // 关联标签是否显示二级下拉框
            firstLabelOneId: '1', // 关联标签选的一级标签；
            firstLabel: [], // 第一级标签
            firstLabel2: [], // 搜索后的第一级标签
            selLabelId: 0, // 点击的哪个labelid
            searchLableName: '', // 标签管理搜索文字
            searchTVWallName: '', // 电视墙搜索文字
            searchPlanName: '', // 电视墙搜索文字
            userTotal: "", //用户总数
            customDeviceId: [], //常用终端id
            customDeviceList: [], //常用终端列表
            deviceList: [], //所有数据
            commonState: "1",
            checkedAll: false, //是否全选
            checkedAllLength: "0", //勾选的数量
            treeList: [], //侧边栏的树的数据
            terminalType: "1", //终端类型,保存类型(视频通信、视频监控、移动终端)用于搜索功能
            indexNum: "0", //判断终端设备、视频监控、移动终端切电视墙等模块用的
            isShowEnterprise: false,//是否显示流媒体企业下拉框，在移动终端模块，来源选择"自动获取"的时候则显示企业下拉框
            enterpriseData: [{ 'name': '111' }, { 'name': '222' }],//企业数据
            enterpriseIDSel: '1',//选择的企业ID,默认企业ID为1
            terminalNumOrName: '',//自动获取掌上通 搜索框数据,手机号或者姓名
            equipment_classification: [{
                name: '终端设备'//'视频通信0'
            },
            {
                name: '视频监控'//1
            },
            {
                name: '移动终端'//2
            },
            {
                name: '电视墙'//新增的3
            },
            {
                name: '三维街景'//4
            },
            {
                name: "常用终端"//5
            },
            {
                name: "收藏设备"//6
            },
            {
                name: "监控轮询"//7
            },
            {
                name: "标签管理"//8
            },
            {
                name: "预案管理"//9
            }
            ],
            batchOperOption: '0', // 批量操作选项
            equipmentSearchInfo: [],
            regionId: "000000000000",
            regionName: '', //当前行政名称
            regionNum: '', //当前行政下数量
            rootNodeData: null,//根结点数据
            firstEnter: true,  //判断是否首次进入页面，首次查询ztree列表
            noTreeFlag: false,  //监控如果没有数据，置为true，显示暂无数据
            monitorRegionId: "000000000000",
            treeNodeTid: '',   //存储5级选中的Tid
            platformID: "", // 平台ID
            pageNum: 1, //用于页面需要
            allpageNum: "", //保存总页数
            terminalNum: "", //终端号
            allDataNum: "", //数据所有条数
            terminalName: "", //终端名称
            search_keyword: "",
            isSelectAll: 0, //全选标记
            selectSwitchVal: "1", // 搜索条件select的值，1为按终端号搜索 2为按终端名称搜索
            deleteArray: "", //删除用户ID数组
            exceptionArray: [], // 选择全部数据时 不进行操作的设备列表
            videoConferencing: [], //视频会议  张昊改 2017-11-9
            videoSurveillance: [], //视频监控  张昊改 2017-11-9
            mobileTerminal: [], //移动终端   张昊改 2017-11-9
            threeDTerminal: [], //三维街景
            pageSize: 10,
            layerLoading: null, //loading
            userInfoId: "", //当前用户id
            source: 2,//视频监控项的数据来源 0：代表所有数据  1：紧代表本地数据  2：代表第三方数据
            city_gradeid: "",//行政级别
            edit_largeTypeList: [],//类型数据列表 张昊改 2017-11-9
            isThreeD: false,//是否开启三维街景
            police_wsUrl: '',//一键报警ws url
            allType: [], //接口返回所有设备类型
            polic_count: 0,//一键报警websocket连接次数
            islayer: false,//一键报警websocket弹框是否弹出过
            process: '',//同步进度
            parcessCountLayer: null,//进度弹框
            processVue: null,//进度弹框vue
            ispoliceWs: false,//是否连接ws
            monitorlayer: null,
            lngAndLatType: 0,//经纬度校验：0是全部 1是正常 2是异常
            LabeldevList: [],//标签管理弹框终端数据
            LabeldevList2: [],
            editCheckLabel: null,//编辑标签弹框
            labelName: '',//标签名称
            isEditor: true,//标签--是编辑还是查看弹框
            detailsTitle: '',//标签弹框标题
            labelId: '',//当前标签的id
            relatednessSearch: '',// 关联标签第一级搜索
            relatednessSearchOne: '',// 关联标签第一级搜索
            relatednessSearch: '',//关联标签搜索
            relatedIsSdarch: false,//关联标签是否搜索
            relatednessLabel2: [],//关联标签搜索后的标签
            relatednessLabel: [],//关联标签全部标签
            deviceLabel: [],//终端所属标签
            selectDev: {},//关联标签，当前点击的终端
            checkedLabelAll: false,//关联标签是否全选
            checkedLabelLength: '0',//关联标签选择的个数
            relatednessLayer: null,//关联标签弹框
            layerSearchType: '1',//标签弹框搜索类型
            layerSeachData: '',//标签弹框搜索内容
            deviceLabelall: [],//终端所属标签
            labeldevLength: 0,//弹框里面终端个数
            oldlabelName: '',//修改前标签名称
            /* 创建预案参数 */
            mainSaveMonitorList: [], // 已保存的监控列表1
            mainSelectMonitorList: [], // 已保存的监控列表选中1
            zTreeMonitorAreaSetting: {
                async: {
                    enable: true,
                    autoParam: ["id=parentCode", "platformID=platformID", "menuType=menuType"],
                    type: "post",
                    url: 'home/getDataTree.do',
                    dataFilter: monitorFilter1
                },
                view: {
                    showLine: false,
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                check: {
                    enable: true,
                    chkStyle: 'checkbox',
                    nocheckInherit: false,
                    chkboxType: { "Y": "", "N": "" },
                    radioType: "level"
                },
                callback: {
                    onClick: onMonitorAreaClick,
                    onCheck: onMonitorCheck,
                }
            },
            zTreeMonitorLabelSetting: {
                async: {
                    enable: true,
                    autoParam: ["deviceID=labelId"],
                    type: "get",
                    // url: 'labelManage/selectLabelDevice.do?menuType=2',
                    url: 'labelManage/getLabelTreeByPid.do?menuType=2',
                    dataFilter: monitorFilter2
                },
                view: {
                    showLine: false,
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "deviceID"
                    }
                },
                check: {
                    enable: true,
                    chkStyle: 'checkbox',
                    radioType: "level"
                },
                callback: {
                    onClick: onMonitorLabelClick,
                    onCheck: onMonitorCheck,
                }
            },
            zTreeMonitorArea: [], // 区域监控树数据
            zTreeMonitorLabel: [], // 标签监控树数据
            copyNode: [], // 备份监控树数据
            num: 1,
            selIsItemId: null,
            searchName: '',
            subSaveMonitorList: [], // 已保存的监控列表2
            subSelectMonitorList: [], // 已保存的监控列表选中2
            isCurTab: '',//是否点击tab切换
            selectTerTypeList: [],
            searchTerType: "",//视联网终端类型 极光、启明3、极光4K等
            isMonitoringUpSwitchActive: 0,//是否开启自动同步监控开发  0是关闭  1是开启
            labelDevPage: 1, // 查看标签 设备列表页数
            labelDevLastPage: 1, // 查看标签 设备列表尾页数
            throttleId: null, // 节流函数Id
            permission: null, //用户状态， 0 超管，
            mapType: null, //地图类型
            offlinemapSwithVal: null, //地图离线状态
            paymentRemindDate: '',//续费提醒日期
            paymentRemindState: '',//续费提醒开关
            EnvironmentFlag: 1,//大网环境开关, 1为大网模式，非1为非大网模式
            dataSource: 'auto', //移动终端数据来源
            areaCode: '000000000000' //用于移动终端 来源为自动获取 时按企业查询tree
        },
        mounted: function () {
            // $nextTick是规范，可以确保插入文档
            var _this = this;
            this.getEnvironmentFlag();//获取大网环境开关状态
            this.permission = $("#userInfoId").attr('data-permission');
            console.log('permission', this.permission);
            if (this.permission != 0 && this.permission != 1) {
                this.regionId = $("#regionbId").val();
                _this.getRenewDialog();
                _this.getRegionNameOrNum();
            }
            console.log('this.regionId', this.regionId);
            this.$nextTick(function () {
                // 加载侧边栏树
                _this.getTreeData(this.regionId);
                _this.getDeviceTypeData();
                _this.getRenewDialog();
                this.userInfoId = $("#userInfoId").val(); //获取当前用户id
                _this.getOfflineMapSetting();
                // _this.classificationClick(_this.indexNum);
            });

            ajaxdata({
                action: 'configuration/getThreeDValue.do'
            }, function (result, data) {
                if (!result || !+data.data) {
                    _this.isThreeD = false; // 关闭三维街景
                } else {
                    _this.isThreeD = true; // 开启三维街景
                }
            });
            ajaxdata({
                action: 'webscoketmonitor/getData.do'
            }, function (result, data) {
                if (result) {
                    _this.police_wsUrl = data.networkInterface + '/' + $('#userInfoId').val(); //一键报警
                } else {
                    layer.msg(data.msg);
                }
            });
            this.getMettingFlag();
        },
        methods: {
            //获取大网环境开关状态
            getEnvironmentFlag () {
                var that = this;
                $.ajax({
                    url: '/gisPlatform/configuration/getNetworkEnvironmentSwitch.do',
                    type: 'get',
                    success: function (data) {
                        if (data.result) {
                            that.EnvironmentFlag = data.data;
                        }
                    }
                })
            },
            // 新增 处理二级选项关闭的可点击区域小的问题
            switchFlagSelect () {
                if (this.indexNum === 9) {
                    this.classfySelectFlag = false
                }
            },
            /**
             * 获取用户是否续费提示弹窗
             */
            getRenewDialog () {
                var that = this;
                ajaxdata({
                    action: 'configuration/getPaymentRemind.do',
                    type: 'get'
                }, function (result, data) {
                    if (result) {
                        that.paymentRemindDate = data.data.paymentRemindDate;
                        that.paymentRemindState = data.data.paymentRemindState;
                        var renewDialog = document.getElementById('myrenewDialog');
                        var ti = document.getElementById('mytishi')
                        newDrag(renewDialog, ti);
                    }
                })
            },
            firstLabelChe: function () {
                var _this = this;
                _this.relatednessLabel2 = [];
                this.firstLabel.find(function (item) {
                    if (item.labelId == _this.firstLabelOneId) {
                        _this.relatednessLabel2 = item.children;
                        _this.devicesFlag = item.devices.length;
                        return true;
                    }
                });
            },
            // 标签下拉选择的是哪个
            selLabelIdFun: function (LabelId) {
                if (LabelId == this.selLabelId) {
                    this.selLabelId = 0;
                    return;
                }
                this.selLabelId = LabelId;
            },
            // 查询第一级标签
            getLabelManageList: function () {
                var _this = this;
                var obj = {
                    action: 'labelManage/selectLabelList.do',
                    type: 'get',
                    pageNum: -1,
                    level: 1,
                };
                ajaxdata(obj, function (result, data) {
                    if (result) {
                        _this.firstLabel = data.list.list;
                        if (data.list.list.length) {
                            _this.firstLabelOneId = data.list.list[0].labelId;
                            _this.relatednessLabel2 = data.list.list[0].children;
                        }
                    } else {
                        layer.msg(data.msg);
                    }
                });
            },
            smartLabeling: function () {
                var obj = {
                    action: 'device/conversionDevice.do',
                    menuType: this.indexNum == "0" ? 1 : 2
                };
                ajaxdata(obj, function (result, data) {
                    if (result) {
                        var layer2 = layer.alert("智能标注开始，稍后会将结果通知给您", {
                            closeBtn: 0
                        }, function () {
                            layer.close(layer2);
                        });
                    } else {
                        layer.msg(data.msg)
                    }
                });
            },
            /**
             *查询  离线地图设置 地图类型
             */
            getOfflineMapSetting: function () {
                //查询  离线地图设置
                let that = this;
                ajaxdata({
                    action: 'configuration/getOfflineMapSetting.do'
                }, function (result, data) {
                    var data2 = JSON.parse(data.data)
                    if (result) {
                        that.offlinemapSwithVal = (data2.status == "0" ? false : true);
                        that.mapType = data2.mapType;
                        console.log('地图', that.offlinemapSwithVal, that.mapType);
                    } else {
                        //layer.msg(data.msg);
                    }
                });
            },
            /**
             *更新坐标
             * url device/updateCleanCoordinateData.do
             * 请求方式 get
             */
            updateCoordinates: function () {
                var lindex = layer.confirm('该操作将更新坐标，是否继续？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    layer.close(lindex);
                    var loading = layer.load();
                    $.ajax({
                        url: 'device/updateCleanCoordinateData.do',
                        type: 'GET',
                        success: function (data) {
                            layer.close(loading);
                            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                    closeBtn: 0
                                }, function () {
                                    location.reload();
                                });
                            }
                            layer.msg(data.msg);
                        },
                        error: function (data) {
                            layer.close(loading);
                        }
                    })
                }, function () {
                    layer.close(lindex);
                });
            },
            //切换批量操作选项
            batchOperOnchange: function () {
                if (this.batchOperOption == '1' || this.batchOperOption == '2') {
                    if (!this.checkedAll) {
                        this.fnClickAll();
                    }
                }
            },
            //翻页
            truningPage: function (type) {
                if (type == "home") { //首页
                    if (this.pageNum == 1) {
                        return;
                    }
                    this.pageNum = 1;
                    vm.layerLoading = layer.load(); //点击分页加load
                    vm.getList();
                } else if (type == "next") { //下一页
                    if (this.pageNum === this.allpageNum) {
                        return;
                    }
                    this.pageNum++;
                    vm.layerLoading = layer.load(); //点击分页加load
                    vm.getList();
                } else if (type == "pre") { //上一页
                    if (this.pageNum === 1) {
                        return;
                    }
                    this.pageNum--;
                    vm.layerLoading = layer.load(); //点击分页加load
                    vm.getList();
                } else if (type == "tail") { //尾页
                    if (this.pageNum == this.allpageNum) {
                        return;
                    }
                    this.pageNum = this.allpageNum;
                    vm.layerLoading = layer.load(); //点击分页加load
                    vm.getList();
                }
            },
            //跳转页
            pageJum: function (data) {
                if (data != null && data != "") {
                    this.pageNum = data;
                    vm.layerLoading = layer.load(); //点击分页加load
                    vm.getList();
                }
            },
            // 去掉空字符串
            deleteEmptyString: function (test, recurse) {

                for (var i in test) {
                    if (test[i] === '') {
                        delete test[i];
                    } else if (recurse && typeof test[i] === 'object') {
                        deleteEmptyString(test[i], recurse);
                    };
                };

            },
            // 查询系统环境配置
            getMettingFlag: function () {
                ajaxdata({ action: 'configuration/getMettingFlag.do', type: 'GET' }, function (result, data) {
                    if (data.result) {
                        vm.status = data.data
                        console.log(vm.status, "deviceSetting")
                    } else {
                        // layer.msg(data.msg);
                    }
                });
            },
            //获取类型列表
            getDeviceTypeData: function () {
                var _this = this;
                ajaxdata({
                    action: "device/getDeviceType.do"
                }, function (result, data) {
                    if (result) {
                        for (var i in data.data) {
                            if (i === 'menuType' || i === 'list99') break;
                            _this.allType = _this.allType.concat(data.data[i]);
                        }
                        _this.edit_largeTypeList = data.data.menuType; //获取大类型列表
                        _this.videoConferencing = data.data.list1; //获取视频通讯列表
                        _this.videoSurveillance = data.data.list2; //获取视频监控列表
                        _this.mobileTerminal = data.data.list5; //获取移动终端列表
                        _this.threeDTerminal = data.data.list6; //获取移动终端列表
                        _this.selectTerTypeList = data.data.list1; //获取视频通讯列表
                        for (var i = 0; i < _this.edit_largeTypeList.length; i++) {
                            var singleData = _this.edit_largeTypeList[i];
                            if (singleData.menuTypeId == 99) {
                                _this.edit_largeTypeList.splice(i, 1);
                            }
                        }
                    } else {
                        layer.msg(data.msg);
                    }
                });
            },
            // 删除确定
            removePopup: function (itemId) {
                var _this = this;
                let deleteType = 0, // 1:全部（按照条件删除） 其他：通过ids删除
                    Ids = ''; // 设备主键ID,拼接的id串
                if (_this.batchOperOption == '0') { //选中数据
                    if (itemId == "") {
                        layer.msg("请选择数据");
                        return
                    }
                    Ids = itemId;
                } else if (_this.batchOperOption == '1') { //当前页数据
                    // Ids = _this.deviceList.map(i => i.id).join();
                    if (itemId == "") {
                        layer.msg("请选择数据");
                        return
                    }
                    Ids = itemId;
                } else { //全部数据
                    deleteType = 1;
                }
                var strmsg = '您确定要删除该条记录吗?';
                var strtitle = '确认删除';
                switch (_this.indexNum) {
                    case 5:
                        strmsg = '您确定将该设备移出常用终端吗?';
                        strtitle = '移除提示';
                        break;
                    case 6:
                        strmsg = '您确定将该设备移出收藏设备吗?';
                        strtitle = '移除提示';
                        break;
                }
                var layerRemove = layer.open({
                    title: strtitle,
                    content: strmsg,
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        if (_this.indexNum == 5) {
                            let list = [];
                            list = _this.deviceList.filter(i => i.checked);
                            var deviceIdArr = [];
                            list.forEach(function (v) {
                                var devid = v.type == 102 ? (v.deviceID ? v.deviceID : v.id) : v.id;
                                deviceIdArr.push(devid)
                            });
                            var Dataobj = {
                                action: 'device/updateUserDevice.do',
                                type: 'post',
                                deviceIds: deviceIdArr.join(','),
                                userId: $("#userInfoId").val(),
                            }
                            ajaxdata(Dataobj, function (result, data) {
                                console.log(result, data)
                                if (result) {
                                    layer.msg("移除常用终端成功");
                                    vm.getList();
                                    layer.close(layerRemove);
                                } else {
                                    layer.msg("移除常用终端失败");
                                }
                            });
                            return
                        }
                        if (_this.indexNum == 6) {
                            let list = [];
                            list = _this.deviceList.filter(i => i.checked);
                            const _state = 0;
                            const li = list.map(function (v) {
                                return {
                                    state: _state,
                                    deviceID: v.type == 102 ? (v.deviceID ? v.deviceID : v.id) : v.id,
                                    userId: $("#userInfoId").val(),
                                    menuType: v.menuType,
                                    type: v.type,
                                    thirdparty: v.thirdparty || 'monitor'
                                }
                            });
                            // console.log(li);
                            _this.batchCollectionRequest(li, _state, function () {
                                vm.layerLoading = layer.load();
                                vm.getList();
                                layer.close(layerRemove);
                            });
                            return
                        }
                        var callPoliceDelete = {
                            removeIds: vm.exceptionArray.filter(i => i && i.trim()).join(","), //排除在外的设备ID
                            Ids, // 设备主键ID,拼接的id串
                            deleteType, // 1:全部（按照条件删除） 其他：通过ids删除
                            menuType: vm.terminalType, // 设备分类大类型大菜单类型
                            number: vm.terminalNum, // 设备号码
                            deviceName: vm.terminalName, // 设备名称
                            equipmentId: vm.regionId, // 当前选择的行政区域ID
                            source: vm.source, // 设备来源标识 默认0
                            gradeid: vm.city_gradeid, // 当前行政区域层级
                            lngAndLatType: vm.lngAndLatType, // 	经纬度状态 默认0 ：全部 1：正常 2：异常
                            userId: vm.userInfoId, // 当前登录用户ID
                            isCheckLngAndLat: true, // 是否过滤经纬度不正常的终端 默认true
                            type: vm.searchTerType == 0 ? "" : vm.searchTerType, // 设备分类小类型
                            action: 'device/remove.do',
                        };
                        // 提交所有id
                        ajaxdata(callPoliceDelete, function (result, data) {
                            if (result) {
                                layer.msg("删除成功");
                                vm.deleteArray = "";
                                vm.getList();
                                layer.close(layerRemove);
                            } else {
                                layer.msg("删除失败");
                            }
                        });
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });

            },
            openEdit: function ($index, flag) { //flag:false(新增)
                countDisable = ""; //初始化级联层级记录
                var _this = this;
                var title = "";
                var name, ip, number, flag64, lng, lat, id, address, principal, phone, url, echoAddress;
                var menuType = "",
                    devno = "",
                    type = "";
                //var showOption = false;//是否显示启明1的选项

                if (flag) {
                    console.log('cascadeList5', cascadeList1, cascadeList5);
                    title = "修改设备";
                    echoAddress = _this.deviceList[$index].echoAddress
                    name = _this.changeValue(_this.deviceList[$index].name);
                    number = _this.deviceList[$index].number;
                    flag64 = _this.deviceList[$index].flag64 == "64位系统" ? 1 : 0;
                    lat = _this.changeValue(_this.deviceList[$index].lat);
                    lng = _this.changeValue(_this.deviceList[$index].lng);
                    ip = _this.changeValue(_this.deviceList[$index].ip);
                    id = _this.deviceList[$index].id;
                    address = _this.changeValue(_this.deviceList[$index].address);
                    principal = _this.changeValue(_this.deviceList[$index].principal);
                    phone = _this.EnvironmentFlag == 1 ? '' : _this.changeValue(_this.deviceList[$index].phone);
                    menuType = _this.deviceList[$index].menuType; //获取当前大类型
                    type = _this.deviceList[$index].type; //获取当前小类型
                    // devno = _this.deviceList[$index].devno || '';  // 自治号码（全局号码）
                    if (_this.deviceList[$index].streetViewUrl == '' || _this.deviceList[$index].streetViewUrl == null) {
                        url = '';
                    } else {
                        url = _this.deviceList[$index].streetViewUrl;
                    }

                    //showOption = true;
                    if (!editSearchOrganization(id)) {
                        return;
                    }
                    if (type == '14') {
                        layer.msg("<p style='text-align:center'>暂时不支持修改虚拟终端!</p>");
                        return;
                    }
                } else {
                    title = "新增设备";
                    //showOption = false;
                    name = "";
                    number = "";
                    ip = "";
                    lat = "";
                    address = "";
                    principal = "";
                    phone = "";
                    lng = "";
                    id = "";
                    url = "";
                    devno = "";
                    if (!oSearchOrganization()) {
                        return;
                    };
                }
                var thisLoad = layer.load();
                //<input type="text" name="1" id="device-name" value="'+name+'" maxlength="256">\
                //<input type="text"  id="device-address" value="'+address+'" maxlength="50">\
                var str = '<div class="userSetting-edit" style="height:6.41rem;">\
			      <div class="edit-header tw-add-header">' + title + '<span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a></span></div>\
			      <div class="edit-main">\
			          <ul>\
			              <li>\
			                  <label for="device-name"><strong class="red">*</strong>终端名称:</label>\
			                  <textarea class="txtarea" id="device-name" style="resize:none;" rows="2" cols="15" maxlength="24">' + name + '</textarea>\
			              </li>\
			              <li>\
			                  <label for="device-number">　<strong class="red">*</strong>终端号:</label>\
			                  <input autocomplete="off" type="text" name="1" id="device-number" value="' + number + '" maxlength="23">\
			              </li>\
			              <li class="form-li">\
			                  <label for="device-number">　<strong class="red">*</strong>终端号类型:</label>\
			                  <span class="hou"><input type="radio" id="flag64" name="numType"  value="1"><label class="typeChoice">64位</label></span>\
			                  <span class="hou"><input type="radio" id="flag16" name="numType"  value="0"><label class="typeChoice">16位</label></span>\
			              </li>\
			              <li>\
			                  <label for="device-ip">　<strong class="red">*</strong>IP地址:</label>\
			                  <input autocomplete="off" type="text" name="1" id="device-ip" value="' + ip + '" maxlength="20">\
                          </li>\
                          <li style="display:none;">\
			                  <label for="device-url">　<strong class="red">*</strong>三维服务地址:</label>\
			                  <input autocomplete="off" type="text" id="device-url" value="' + url + '" maxlength="50">\
		                  </li>\
			              <li class="two-select">\
			                  <label for="deviceType">　类　型:</label>\
			                          <span>\
			                            <select id="inputType_one">\
                                         </select>\
			                            <i></i>\
			                          </span>\
			                           <span class="add-type-2">\
				                             <select id="inputType_two">\
			                                  </select>\
				                            <i></i>\
				                        </span>\
			              </li>\
			               <li class="long-height">\
			  			                  <label for="deviceType" class="fl"><strong class="red">*</strong>所属区域:</label>\
			  			                  <div id="area" style="display: none;width: 2.7rem;">\
			  			                    <input type="hidden" id="echoaddress" />\
			  			                    <input type="hidden" id="menuCatalog" />\
			  			                    <input id="areaInput" onkeydown="getAreaData(event)" data-gradeid="6" class="sel6" style="width: 100%;" /><ul id="areaList"></ul></div>\
			  		                          <div class="three-linkage fl">\
			  		                              <div>\
			  			                            <select id="chooseSel1" data-gradeid="1" class="sel1" onchange="gradeChange(this)">';

                //视联网全局号码暂时注释，字符串中不能有注释暂放这里
                // <li class="devNumberShow">\
                //     <label for="device-devno">　<strong class="red">*</strong>视联网全局号码:</label>\
                //     <input autocomplete="off" type="text"  id="device-devno" value="' + devno + '" maxlength="23">\
                // </li>\
                if (cascadeList1) {
                    str += '<option data-id="">请选择省</option>';
                    for (var i = 0; i < cascadeList1.length; i++) {
                        if (selectFirstId == cascadeList1[i].id) {
                            str += '<option data-id="' + cascadeList1[i].id + '" selected="selected">' + cascadeList1[i].name + '</option>';
                        } else {
                            str += '<option data-id="' + cascadeList1[i].id + '">' + cascadeList1[i].name + '</option>';
                        };
                    };
                } else {
                    str += '<option data-id="">请选择省</option>';
                };
                str += '</select>\
			  			                            <i></i>\
			  			                          </div>\
			  			                          <div>\
			  			                            <select id="chooseSel2" class="city sel2" data-gradeid="2" onchange="gradeChange(this)" disabled="disabled">';
                if (flag) {
                    if (cascadeList2) {
                        str += '<option data-id="">请选择</option>';
                        for (var i = 0; i < cascadeList2.length; i++) {
                            if (selectSecondId == cascadeList2[i].id) {
                                str += '<option data-id="' + cascadeList2[i].id + '" selected="selected">' + cascadeList2[i].name + '</option>';
                            } else {
                                str += '<option data-id="' + cascadeList2[i].id + '">' + cascadeList2[i].name + '</option>';
                            }
                        }
                    } else {
                        str += '<option>请先选择省</option>';
                    };
                } else {
                    str += '<option>请先选择省</option>';
                }
                str += '</select>\
			  			                            <i class="city"></i>\
			  			                          </div>\
			  			                          <div>\
			  			                           <select id="chooseSel3" data-gradeid="3" class="sel3" onchange="gradeChange(this)" disabled="disabled">';
                if (flag) {
                    if (cascadeList3) {
                        str += '<option data-id="">请选择</option>';
                        for (var i = 0; i < cascadeList3.length; i++) {
                            if (selectThirdId == cascadeList3[i].id) {
                                str += '<option data-id="' + cascadeList3[i].id + '" selected="selected">' + cascadeList3[i].name + '</option>';
                            } else {
                                str += '<option data-id="' + cascadeList3[i].id + '">' + cascadeList3[i].name + '</option>';
                            }
                        }
                    } else {
                        str += '<option>请先选择市</option>';
                    };
                } else {
                    str += '<option>请先选择市</option>';
                }
                str += '</select>\
			  			                            <i></i>\
			  			                          </div>\
			  			                          <div>\
			  			                            <select id="chooseSel4" class="township sel4" data-gradeid="4"  onchange="gradeChange(this)" disabled="disabled">';
                if (flag) {
                    if (cascadeList4) {
                        str += '<option data-id="">请选择</option>';
                        for (var i = 0; i < cascadeList4.length; i++) {
                            if (selectFourId == cascadeList4[i].id) {
                                str += '<option data-id="' + cascadeList4[i].id + '" selected="selected">' + cascadeList4[i].name + '</option>';
                            } else {
                                str += '<option data-id="' + cascadeList4[i].id + '">' + cascadeList4[i].name + '</option>';
                            }
                        }
                    } else {
                        str += '<option>请选择</option>';
                    };
                } else {
                    str += '<option>请选择</option>';
                }
                str += '</select>\
			  			                            <i class="township"></i>\
			  			                          </div>\
			  	                              <div>\
			  	                              <select id="chooseSel5" class="township sel5" data-gradeid="5"  onchange="gradeChange(this)" disabled="disabled">';
                if (flag) {
                    if (cascadeList5) {
                        str += '<option data-id="">请选择</option>';
                        for (var i = 0; i < cascadeList5.length; i++) {
                            if (selectFiveId == cascadeList5[i].id) {
                                str += '<option data-id="' + cascadeList5[i].id + '" selected="selected">' + cascadeList5[i].name + '</option>';
                            } else {
                                str += '<option data-id="' + cascadeList5[i].id + '">' + cascadeList5[i].name + '</option>';
                            }
                        }
                    } else {
                        str += '<option>请选择</option>';
                    };
                } else {
                    str += '<option>请选择</option>';
                }

                str += '</select></div>\
                        </li>\
			  			  <li>\
		  			    	<label for="device-lng">具体地址:</label>\
		  			    	<span>\
		  			    		<textarea class="txtarea" id="device-address" style="resize:none;" rows="2" cols="25" maxlength="50">' + address + '</textarea>\
		  			    		</span>\
		  			      </li>\
		  			   <li>\
		  			    	<label for="device-lng">单位负责人:</label>\
		  			    	<span>\
		  			    		<input autocomplete="off" type="text"  id="device-principal" value="' + principal + '" maxlength="20">\
		  			    	</span>\
	  			      </li>\
			              <li>\
			                  <label for="device-lng"><strong class="red"></strong>负责人电话:</label>\
			                          <span>\
			                            <input autocomplete="off" type="text"  id="device-phone" value="' + phone + '" maxlength="11">\
			                          </span>\
			              </li>\
			              <li>\
		                       <label for="device-lng">　经　度:</label>\
		                          <span>\
		                            <input autocomplete="off" type="text"  id="device-lng" value="' + lng + '" maxlength="20">\
		                          </span>\
		                  </li>\
			              <li>\
			                  <label for="device-lat">　纬　度:</label><span>\
					          <span>\
	                              <input autocomplete="off" type="text"  id="device-lat" value="' + lat + '" maxlength="20">\
	                          </span>\
			              </li>\
			          </ul>\
			          <div class="edit-function clearfix">\
	                      <a href="javascript:;" class="edit-confirm">确定</a>\
			              <a href="javascript:;" class="edit-close">取消</a>\
			          </div>\
			      </div>\
			  </div>';
                var o = layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    content: str, //userSetting-edit  str
                    area: ['4.83rem', '6.41rem'],
                    success: function (index, o) {
                        layer.close(thisLoad);
                        let pageSize = 10  //请求的条数
                        let pageNum = 1  //  页数
                        let pageCount = 0 //  总页数
                        let pageTotal = 0  // 总条数
                        // 编辑的时候如果状态是2 显示视频监控内容
                        if (menuType === 2) {
                            $(".long-height").css({ height: ".4rem" })
                            $(".three-linkage").hide()
                            $("#area").show()
                            getAreaData(undefined, 'edit')
                            $("#areaInput").val(echoAddress)
                        } else {
                            $(".long-height").css({ height: "1.2rem" })
                            $(".three-linkage").show()
                            $("#area").hide()
                        }
                        if (flag64 == 1 || flag64 == null) {
                            $("#flag64").prop("checked", "checked");
                            $(".devNumberShow").show();
                        } else if (flag64 == 0) {
                            $("#flag16").prop("checked", "checked");
                            $(".devNumberShow").hide();
                        }
                        //获取大类型列表
                        $("#inputType_one").html("");
                        _this.edit_largeTypeList.forEach(function (item) {
                            //console.log(item);
                            if (item.menuTypeId != 7) {
                                var content = "<option value='" + item.menuTypeId + "'>" + item.menuTypeName + "</option>";
                                $("#inputType_one").append(content);
                            }
                        });
                        if (flag) {
                            console.log('cascadeList4', cascadeList1, cascadeList4, cascadeList5);
                            $("#inputType_one").val(menuType);

                            if ($("#inputType_one").val() == 1) {
                                if (_this.videoConferencing.length > 0) {
                                    loopList(_this.videoConferencing);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }
                            } else if ($("#inputType_one").val() == 2) {
                                if (_this.videoSurveillance.length > 0) {
                                    loopList(_this.videoSurveillance);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }

                            } else if ($("#inputType_one").val() == 5) {
                                if (_this.mobileTerminal.length > 0) {
                                    loopList(_this.mobileTerminal);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }

                            } else if ($('#inputType_one').val() == 6) {
                                if (_this.threeDTerminal.length > 0) {
                                    loopList(_this.threeDTerminal);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }

                                $('#device-url').parent().show();
                            }
                            $("#inputType_two").val(type);
                        } else { //添加
                            loopList(_this.videoConferencing);
                        }
                        // 所属区域输入框聚焦后显示列表
                        $("#areaInput").focus(function () {
                            $("#areaList").css({ "display": "block" })
                        })

                        // 所属区域输入框聚焦回车
                        $("#areaInput").bind("keydown", function (e) {
                            if (e.keyCode === 13) {
                                pageNum = 1
                                pageSize = 10
                                getAreaData("keyCode", 'edit')
                            }
                        })

                        // 点击外层影藏列表
                        // $(".userSetting-edit").click(function(){
                        //     $("#areaList").css({"display": "none"})
                        // })

                        // 列表点击后隐藏 赋值到输入框
                        $("#areaList").on("click", "li", function (el) {
                            $("#areaList").css({ "display": "none" })
                            $("#areaInput").val(el.target.innerHTML)
                            $("#menuCatalog").val(el.target.getAttribute("areacode"))
                            $("#echoaddress").val(el.target.getAttribute("platformid"))
                            $("#pid").val(el.target.getAttribute("parentCode"))
                            pageNum = 1
                        })

                        $("#areaList").on("scroll", function (el) {
                            let areaListLen = $("#areaList li").length  //  列表的数据长度
                            if (areaListLen === pageTotal) return;  //  如果列表的长度和接口返回的数据总数一样不请求
                            let scrollTop = el.target.scrollTop  //  距离顶部高度
                            let clientHeight = el.target.clientHeight  // 可视高度
                            let scrollHeight = el.target.scrollHeight  // 元素高度
                            if ((scrollTop + clientHeight) === scrollHeight) {
                                pageNum += 1
                                if (pageNum > pageCount) return;
                                // 滚动加载的时候不传递name名称
                                getAreaData(undefined, 'scroll')
                            }
                        })
                        function getAreaData (type, edit) {
                            $.ajax({
                                url: "organization/pageLocalMServerOrganization.do",
                                type: "GET",
                                data: { page: pageNum, size: pageSize, name: edit == 'edit' || $("#areaInput").val() != "" ? $("#areaInput").val() : "" },
                                success: function (data) {
                                    pageCount = data.data.pages  // 总页数
                                    pageTotal = data.data.total   //  数据总个数
                                    // 如果进行回车搜索的时候并且输入框里边有值
                                    if (type && type == "keyCode" && $("#areaInput").val() != "") {
                                        //返回的数据部位空 渲染页面
                                        if (data.data.list.length != 0) {
                                            $("#areaList").empty()
                                            for (let i = 0; i < data.data.list.length; i++) {
                                                let Li = document.createElement("li")
                                                Li.innerHTML = data.data.list[i].name
                                                Li.setAttribute("parentCode", data.data.list[i].parentCode)
                                                Li.setAttribute("areaCode", data.data.list[i].areaCode)
                                                Li.setAttribute("platformId", data.data.list[i].platformId)
                                                $("#areaList").append(Li)
                                            }
                                        } else {
                                            // 否则就清空列表
                                            $("#areaList").empty()
                                        }
                                    } else {
                                        if (type && type == "keyCode" && $("#areaInput").val() == "") {
                                            $("#areaList").empty()
                                        }
                                        for (let i = 0; i < data.data.list.length; i++) {
                                            let Li = document.createElement("li")
                                            Li.innerHTML = data.data.list[i].name
                                            Li.setAttribute("parentCode", data.data.list[i].parentCode)
                                            Li.setAttribute("areaCode", data.data.list[i].areaCode)
                                            Li.setAttribute("platformId", data.data.list[i].platformId)
                                            $("#areaList").append(Li)
                                        }
                                    }
                                }
                            })
                        }
                        $("#inputType_one").change(function () {
                            // 如果是视频监控所属区域改成一个选项
                            if ($('#inputType_one').val() == '2') {
                                $(".long-height").css({ height: ".4rem" })
                                $(".three-linkage").hide()
                                $("#area").show()
                                getAreaData()
                            } else {
                                $(".long-height").css({ height: "1.2rem" })
                                $(".three-linkage").show()
                                $("#area").hide()
                            }
                            $("#inputType_two").html("");
                            $('#device-url').parent().hide();
                            if ($("#inputType_one").val() == 1) {
                                if ($("input[name='numType']:checked").val() == 1) {
                                    $(".devNumberShow").show();
                                }
                                if (_this.videoConferencing.length > 0) {
                                    loopList(_this.videoConferencing);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }
                            } else if ($("#inputType_one").val() == 2) {
                                // yx 此处的是类型为视频监控的时候
                                $('#chooseSel1_SelectWrapBox').hide()
                                $(".devNumberShow").hide();
                                if (_this.videoSurveillance.length > 0) {
                                    loopList(_this.videoSurveillance);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }

                            } else if ($("#inputType_one").val() == 5) {
                                $(".devNumberShow").hide();
                                if (_this.mobileTerminal.length > 0) {
                                    loopList(_this.mobileTerminal);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }

                            } else if ($('#inputType_one').val() == 6) {
                                $(".devNumberShow").hide();
                                if (_this.threeDTerminal.length > 0) {
                                    loopList(_this.threeDTerminal);
                                    $('#inputType_two').css('background', 'transparent');
                                    $('#inputType_two').removeAttr('disabled');
                                } else {
                                    $('#inputType_two').css('background', '#ccc');
                                    $('#inputType_two').attr('disabled', 'disabled');
                                }

                                $('#device-url').parent().show();
                            }
                        });
                        $("input[name='numType']").change(function () {
                            var numType = $("input[name='numType']:checked").val();
                            if (numType == 1 && $("#inputType_one").val() == 1) {
                                $(".devNumberShow").show();
                            } else {
                                $(".devNumberShow").hide();
                            }
                        });

                        //循环遍历改变大类型时改变小类型
                        function loopList (dataList) {
                            dataList.forEach(function (item) {
                                var content = "<option value='" + item.deviceTypeId + "'>" + item.deviceTypeName + "</option>";
                                $("#inputType_two").append(content);
                            });
                        }

                        /**选择大小类型设备关联选中***/

                        if (flag) { //修改时候默认选中用户类型
                            $("#deviceType option").each(function () {
                                if (_this.deviceList[$index].type == $(this).attr("data-id")) {
                                    $(this).attr("selected", true);
                                }
                            });
                        };
                        /***关闭按钮***/
                        $(".edit-close").click(function () {
                            layer.close(o);
                        });
                        /**判断级联解除几个禁用***/
                        if (countDisable == "1") {
                            $(".sel2").removeAttr("disabled");
                        } else if (countDisable == "2") {
                            $(".sel2").removeAttr("disabled");
                            $(".sel3").removeAttr("disabled");
                        } else if (countDisable == "3" || countDisable == "4") {
                            $(".sel2").removeAttr("disabled");
                            $(".sel3").removeAttr("disabled");
                            $(".sel4").removeAttr("disabled");
                        } else if (countDisable == "5") {
                            $(".sel2").removeAttr("disabled");
                            $(".sel3").removeAttr("disabled");
                            $(".sel4").removeAttr("disabled");
                            $(".sel5").removeAttr("disabled");
                        }
                        /**绑定确定事件**/
                        $(".edit-confirm").click(function () {
                            var url = "";
                            var id, version;
                            var number = $("#device-number").val().replace(/\s/ig, '') + ''; //终端号
                            var flag64 = $("input[name='numType']:checked").val();
                            var name = $("#device-name").val().replace(/\s/ig, ''); //设备名称
                            var ip = $("#device-ip").val().replace(/(^\s*)|(\s*$)/g, ''); //IP号码(去掉前后空格)
                            var address = $("#device-address").val().replace(/\s/ig, ''); //具体地址
                            var principal = $("#device-principal").val().replace(/\s/ig, ''); //单位负责人
                            var phone = $("#device-phone").val().replace(/\s/ig, ''); //负责人电话
                            var smallType = $("#inputType_two").val(); //小类型id
                            var streetViewUrl = $('#device-url').val();
                            // var devno = $('#device-devno').val();
                            //var menuType = parseInt($("#inputType_one option:selected").attr("data-id"));
                            //var type = parseInt($("#inputType_two option:selected").attr("data-id"));

                            var sel1 = $(".sel1").find("option:selected"); //省
                            var sel2 = $(".sel2").find("option:selected"); //市
                            var sel3 = $(".sel3").find("option:selected"); //县、区
                            var sel4 = $(".sel4").find("option:selected"); //街道
                            var sel5 = $(".sel5").find("option:selected"); //居委会
                            var oid1 = checkValue(sel1.attr("data-id")); //省
                            var oid2 = checkValue(sel2.attr("data-id")); //市
                            var oid3 = checkValue(sel3.attr("data-id")); //县、区
                            var oid4 = checkValue(sel4.attr("data-id")); //街道
                            var oid5 = checkValue(sel5.attr("data-id")); //居委会
                            var lng = $("#device-lng").val(); //经度
                            var lat = $("#device-lat").val(); //维度
                            //验证终端名称
                            if (name == "") {
                                layer.msg("<p style='text-align:center'>终端名称不能为空!</p>");
                                return;
                            }
                            var refuserName = /^[A-Za-z0-9\u4e00-\u9fa5_]+$/;
                            if (name && !refuserName.test(name)) {
                                layer.msg("<p style='text-align:center'>终端名称应是英文、数字、中文</p>");
                                return;
                            }
                            //验证终端号
                            if (number == "") {
                                layer.msg("<p style='text-align:center'>终端号不能为空!</p>");
                                return;
                            }
                            // console.log(smallType);
                            if ($("#inputType_one").val() == 2) { //视频监控
                                var numPattern = /^([0-9]{1,11})(#[0-9]{1,11})$/;
                                if (!numPattern.test(number)) {
                                    layer.msg("<p style='text-align:center'>监控类型终端号应是 12345#123 的格式!</p>");
                                    return;
                                }
                            } else if ($("#inputType_one").val() == 5) { // 移动终端
                                var numPattern = /^([0-9]{1,11})(#[0-9]{1,7})?$/;
                                if (!numPattern.test(number)) {
                                    layer.msg("<p style='text-align:center'>终端号不可长于11位数字或123#123的格式!</p>");
                                    return;
                                }
                            } else {
                                var numPattern = /^\d{1,11}$/;
                                if (!numPattern.test(number)) {
                                    layer.msg("<p style='text-align:center'>终端号不可长于11位数字!</p>");
                                    return;
                                }
                            }
                            //验证终端号类型
                            if (flag64 == "" || flag64 == undefined) {
                                layer.msg("<p style='text-align: '>请选择终端号类型</p>");
                                return;
                            }
                            // if(flag64 == 1 && $("#inputType_one").val() == 1){
                            //     var redex = /^([0-9]{5})(([\-][0-9]{5}){3})$/;
                            //     if (!redex.test(devno)) {
                            //         layer.msg("请输入正确的数据格式，如:12345-12345-12345-12345")
                            //         return false;
                            //     }
                            // }
                            //  验证ip
                            var ipPattern = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/; //正则匹配IP
                            if (!ipPattern.test(ip)) {
                                layer.msg("<p style='text-align:center'>请输入正确的IP!</p>");
                                return;
                            }
                            if ($("#inputType_one").val() == 6 && !/wss?:\/\/(\d{1,3}.){3}\d{1,3}:\d{1,5}/.test(streetViewUrl)) {
                                layer.msg("<p style='text-align:center'>请输入正确的三维服务地址!</p>");
                                return;
                            }
                            //  验证省市区
                            if ($('#inputType_one').val() == '2') {
                                if ($("#areaInput").val() == "") {
                                    return layer.msg("<p style='text-align:center'>请选择所属区域!</p>");
                                }
                            } else {
                                //否则判断所有区域选项
                                if (!oid1) {
                                    layer.msg("<p style='text-align:center'>请选择省或市!</p>");
                                    return;
                                }

                                /**
                                 * 加验证 针对终端原始行政机构数据错误的验证
                                 */
                                // if (sel2.text() == "请选择" && sel3.text() != "请选择") {
                                //     return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                // }
                                // console.log(sel1.text(), sel2.text(), sel3.text(), sel4.text(), '行政区域的变化');
                                // console.log(
                                //     sel1.text().indexOf('选择') > -1,
                                //     (sel2.text().indexOf('选择') == -1) && (sel1.text().indexOf('选择') > -1),
                                //     (sel3.text().indexOf('选择') == -1) && ((sel2.text().indexOf('选择') > -1) || (se1.text().indexOf('选择') > -1)),
                                //     (sel4.text().indexOf('选择') == -1) && ((sel3.text().indexOf('选择') > -1) || (sel2.text().indexOf('选择') > -1)  || (sel1.text().indexOf('选择') > -1))
                                // );
                                if (sel1.text().indexOf('选择') > -1) {
                                    return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                }
                                if (sel1.text().indexOf('市') > -1) {
                                    // 直辖市
                                    if ((sel2.text().indexOf('选择') == -1) && (sel1.text().indexOf('选择') > -1)) {
                                        return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                    } else if ((sel3.text().indexOf('选择') == -1) && ((sel2.text().indexOf('选择') > -1) || (sel1.text().indexOf('选择') > -1))) {
                                        return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                    }
                                } else {
                                    if ((sel2.text().indexOf('选择') == -1) && (sel1.text().indexOf('选择') > -1)) {
                                        return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                    } else if ((sel3.text().indexOf('选择') == -1) && ((sel2.text().indexOf('选择') > -1) || (sel1.text().indexOf('选择') > -1))) {
                                        return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                    } else if ((sel4.text().indexOf('选择') == -1) && ((sel3.text().indexOf('选择') > -1) || (sel2.text().indexOf('选择') > -1) || (sel1.text().indexOf('选择') > -1))) {
                                        console.log(sel4.text(), sel3.text(), sel2.text(), sel1.text(), (sel4.text().indexOf('选择') == -1), ((sel3.text().indexOf('选择') > -1) || (sel2.text().indexOf('选择') > -1) || (sel1.text().indexOf('选择') > -1)));
                                        return layer.msg("<p style='text-align:center'>请正确配置所属区域!</p>");
                                    }
                                }
                            }


                            if (phone.length) {//非必填项，有值则校验号码，无值则不校验
                                //  验证手机号
                                // var phoneNum = /^[0-9]{6,}$/; //正则验证电话号/^1[0-9]{10}$/
                                var phoneNum = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])[0-9]{8}$/; //正则验证电话号
                                if (!phoneNum.test(phone)) {
                                    layer.msg("<p style='text-align:center'>请输入合法的电话!</p>");
                                    return;
                                }
                            }


                            //  验证经纬度
                            if (lng.trim() != "") { //如果经度不为空 就验证一下真伪
                                //var pattern1 =/^-?((0|[1-9]\d?|1[1-7]\d)(\.\d{1,7})?|180(\.0{1,7})?)?$/;
                                var pattern1 = /^[-]?(\d|([1-9]\d)|(1[0-7]\d)|(180))(\.\d*)?$/g; //经度
                                if (!pattern1.test(lng)) {
                                    layer.msg("<p style='text-align:center'>请输入合法的经度!</p>");
                                    return;
                                }
                                if (!lng) {
                                    lng = 0;
                                }
                            }
                            if (lat.trim() != "") { //如果纬度不为空 就验证一下真伪
                                //var pattern2 = /^-?((0|[1-8]\d|)(\.\d{1,7})?|90(\.0{1,7})?)?$/
                                var pattern2 = /^[-]?(\d|([1-8]\d)|(90))(\.\d*)?$/g; //维度
                                if (!pattern2.test(lat)) {
                                    layer.msg("<p style='text-align:center'>请输入合法的纬度!</p>");
                                    return;
                                }
                                if (!lat) {
                                    lat = 0;
                                }
                            }
                            if ($("#inputType_two").val() == '14') {
                                if (id) {
                                    layer.msg("<p style='text-align:center'>暂时不支持修改虚拟终端!</p>");
                                    return;
                                }
                                layer.msg("<p style='text-align:center'>暂时不支持添加虚拟终端!</p>");
                                return;
                            }
                            var thirdparty;
                            if (flag) {
                                id = _this.deviceList[$index].id;
                                version = _this.deviceList[$index].version;
                                url = "device/modify.do";
                                thirdparty = _this.deviceList[$index].thirdparty;
                            } else {
                                id = "";
                                version = "",
                                    url = "device/create.do";
                                thirdparty = '';
                            }

                            var idarray = "" //选择所属区域
                            var idarray_txt = "" //选择所属区域汉子信息
                            var arr = "";
                            var arr2 = [];
                            var equipmentPid = null
                            var equipmentId = null
                            if ($('#inputType_one').val() == '2') {
                                idarray = $("#menuCatalog").val()
                                idarray_txt = $("#areaInput").val()
                                equipmentPid = $("#menuCatalog").val()
                                equipmentId = ""
                            } else {
                                idarray = oid1 + "/" + oid2 + "/" + oid3 + "/" + oid4 + "/" + oid5; //选择所属区域
                                idarray_txt = sel1.text() + "/" + sel2.text() + "/" + sel3.text() + "/" + ((sel4.text() == "无") ? "" : sel4.text()) + "/" + ((sel5.text() == "无") ? "" : sel5.text()); //选择所属区域汉子信息
                                arr = idarray.split('/');
                                arr2 = [];
                                for (var i = arr.length - 1; i >= 0; i--) {
                                    if (arr2.length < 2) {
                                        if (arr[i]) {
                                            arr2.push(arr[i]);
                                        }
                                        if (i == 0 && !oid2) {
                                            arr2.push('000000000000');
                                        }
                                    } else {
                                        break;
                                    }
                                }
                                equipmentPid = arr2[1];
                                equipmentId = arr2[0];
                            }

                            var type;
                            if ($("#inputType_two").val()) {
                                type = $("#inputType_two").val();
                            } else if ($("#inputType_one").val() == 6) {
                                // 三维街景暂时没有类型，填写-1
                                type = -1;
                            }
                            if (this.clickTag) {
                                layer.msg('请勿频繁点击');
                                return;
                            }
                            this.clickTag = 1;
                            var noDotClick = setTimeout(function () {
                                this.clickTag = 0;
                            }, 5000);
                            clearTimeout(noDotClick);
                            var that = this;
                            var sendData = {
                                flag64: flag64,
                                id: id,
                                version: version,
                                // number: number.replace(/\b(0+)/gi, ""),
                                number: number,
                                name: name,
                                lng: lng,
                                lat: lat,
                                menuType: $("#inputType_one").val(),
                                type: type,
                                // devno: devno,
                                address: address,
                                phone: phone,
                                principal: principal,
                                ip: ip,
                                menuCatalog: idarray,
                                echoAddress: idarray_txt,
                                equipmentPid: equipmentPid,
                                equipmentId: equipmentId,
                                thirdparty: thirdparty, //本地的还是同步过来的
                                streetViewUrl: $("#inputType_one").val() == 6 ? streetViewUrl : ''
                            };
                            if (vm.EnvironmentFlag == 1 && !phone.length && flag) {
                                //更新数据 大网模式下，且手机号码输入框内容为空，则不更新电话号码信息
                                sendData.phone = _this.deviceList[$index].phone;
                            }
                            $.ajax({
                                url: url,
                                type: "POST",
                                data: sendData,
                                dataType: "json",
                                success: function (data) {
                                    if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                        layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                            closeBtn: 0
                                        }, function () {
                                            location.reload();
                                        });
                                        return;
                                    }
                                    var result = data.result;
                                    if (result) {
                                        layer.close(o);
                                        _this.getList();

                                    }
                                    that.clickTag = 0;
                                    layer.msg("<p style='text-align:center'>" + data.msg + "!</p>");
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    layer.msg("<p style='text-align:center'>操作失败!</p>");
                                }
                            });

                        });
                    }
                });
            },
            /*
            * 查看掌上通用户详细
            *
            * */
            lookPalmtop: function ($index) {
                var that = this;
                const id = vm.deviceList[$index].id;//获得企业用户ID
                const thisLoad = layer.load();
                //请求用户详细信息
                $.ajax({
                    url: "p_server_api/get_enterprise_user_detail.do",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({ 'id': id }),
                    contentType: "application/json;charset=UTF-8",
                    success: function (json) {
                        layer.close(thisLoad);
                        if (json.result == "ok") {
                            if (that.EnvironmentFlag == 1) {
                                json.data.phonenum = '';
                            }
                            const userDetail = json.data
                            let str = '<div class="userSetting-detail" style="height:6.01rem;">\
                              <div class="edit-header tw-add-header">设备详情<span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a></span></div>\
                                  <div class="edit-main" style="height:4.81rem; overflow-y:scroll;">\
                                      <ul>\
                                          <li>\
                                              <label for="realname">用户姓名:</label>\
                                              <input autocomplete="off" type="text" name="realname" id="realname" value="' + (userDetail.realname ? userDetail.realname : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="phonenum">手机号:</label>\
                                              <input autocomplete="off" type="text" name="phonenum" id="phonenum" value="' + (userDetail.phonenum ? userDetail.phonenum : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="id_card">证件号码:</label>\
                                              <input autocomplete="off" type="text" name="id_card" id="id_card" value="' + (userDetail.id_card ? userDetail.id_card : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="region_name">地区:</label>\
                                              <input autocomplete="off" type="text" name="region_name" id="region_name" value="' + (userDetail.region_name ? userDetail.region_name : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="realname">工作单位:</label>\
                                              <input autocomplete="off" type="text" name="1" value="' + '暂无数据' + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="realname">职务:</label>\
                                              <input autocomplete="off" type="text" name="1" value="' + '暂无数据' + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="role_name">角色:</label>\
                                              <input autocomplete="off" type="text" name="role_name" id="role_name" value="' + (userDetail.role_name ? userDetail.role_name : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="status">状态:</label>\
                                              <input autocomplete="off" type="text" name="status" id="status" value="' + (userDetail.status == "ONLINE" ? "在线" : "离线") + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="createtime">注册时间:</label>\
                                              <input autocomplete="off" type="text" name="1" id="createtime" value="' + dateToString(userDetail.createtime) + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="device_name">设备名称:</label>\
                                              <input autocomplete="off" type="text" name="device_name" id="device_name" value="' + (userDetail.device_name ? userDetail.device_name : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="device_type">设备类型:</label>\
                                              <input autocomplete="off" type="text" name="device_type" id="device_type" value="' + (userDetail.device_type ? userDetail.device_type : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="app_version">APP版本:</label>\
                                              <input autocomplete="off" type="text" name="app_version" id="app_version" value="' + (userDetail.app_version ? userDetail.app_version : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_account">流媒体账号:</label>\
                                              <input autocomplete="off" type="text" name="stream_account" id="stream_account" value="' + (userDetail.stream_account ? userDetail.stream_account : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_server_user_no">流媒体用户号:</label>\
                                              <input autocomplete="off" type="text" name="stream_server_user_no" id="stream_server_user_no" value="' + (userDetail.stream_server_user_no ? userDetail.stream_server_user_no : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_server_name">流媒体名称:</label>\
                                              <input autocomplete="off" type="text" name="stream_server_name" id="stream_server_name" value="' + (userDetail.stream_server_name ? userDetail.stream_server_name : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_server_ip">流媒体IP:</label>\
                                              <input autocomplete="off" type="text" name="stream_server_ip" id="stream_server_ip" value="' + (userDetail.stream_server_ip ? userDetail.stream_server_ip : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_server_port">流媒体端口号:</label>\
                                              <input autocomplete="off" type="text" name="stream_server_port" id="stream_server_port" value="' + (userDetail.stream_server_port ? userDetail.stream_server_port : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_server_master_number">流媒体主消息号:</label>\
                                              <input autocomplete="off" type="text" name="stream_server_master_number" id="stream_server_master_number" value="' + (userDetail.stream_server_master_number ? userDetail.stream_server_master_number : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="stream_server_version">H5版本:</label>\
                                              <input autocomplete="off" type="text" name="stream_server_version" id="stream_server_version" value="' + (userDetail.stream_server_version ? userDetail.stream_server_version : '') + '" maxlength="23" disabled>\
                                          </li>\
                                          <li>\
                                              <label for="add_reason">添加原因:</label>\
                                              <input autocomplete="off" type="text" name="add_reason" id="add_reason" value="' + (userDetail.add_reason ? userDetail.add_reason : '') + '" maxlength="23" disabled>\
                                          </li>\
                                      </ul>\
                                  </div>\
                                  <div class="edit-function clearfix">\
                                    <a href="javascript:;" class="edit-close">关闭</a>\
                                  </div>\
                              </div>';
                            const o = layer.open({
                                type: 1,
                                title: false,
                                closeBtn: 0,
                                content: str, //userSetting-detail  str
                                area: ['4.63rem', '6.01rem'],
                                success: function (index, o) {
                                    /***关闭按钮***/
                                    $(".edit-close").click(function () {
                                        layer.close(o);
                                    });
                                }
                            });
                        } else {
                            layer.alert("查询掌上通用户信息失败");
                        }
                    },
                    error: function () {
                        layer.close(thisLoad);
                        layer.alert("查询掌上通用户信息失败");
                        return;
                    }
                });
            },

            /*！
            * 功能：添加电视墙
            * 作者：庾少华
            *time:20200611
            */
            addTVwall: function () {
                var o = layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    content: '<div class="TVbox" style="">' +
                        '<div class="TVtitle"><span class="sptit">增加电视墙</span><span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" style="right: -10%"></a></span></div>' +
                        '<div class="TVbody">' +
                        '<UL class="TVul">' +
                        '<li class="liName"><lable>终端名称:</lable><input autocomplete="off" id="wallName" placeholder="请输入终端名称" maxlength="50"></li>' +
                        '<li class="liName"><lable> 16/ 64位:</lable><select style="width: 3.42rem;" id="selV2Vtype"><option value="1">64</option><option value="0">16</option></select></li>' +
                        '</UL>' +
                        '<laber class="v2vlab">视联网号码：</laber><span class="addUlNum">添加</span>' +
                        '<div class="listbox">' +
                        '<ul class="clearfix "><li class="fl"><input autocomplete="off" class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li></ul>' +
                        '<ul class="clearfix ulTwo"><li class="fl"><input autocomplete="off" class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"> <i class="del_i"></i></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li></ul>' +
                        '<div class="addTVfunbox edit-function clearfix">' +
                        '<a href="javascript:;" class="edit-confirm fl" id="postTVdata">保存</a>' +
                        '<a href="javascript:;" class="edit-close fr">关闭</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>', //userSetting-edit  str
                    area: ['5.53rem', '5.98rem'],
                    move: '.sptit'
                });
                //点击添加一组电视墙号码
                $('.addUlNum').click(function () {
                    $('.ulTwo').show();
                });
                //删除一组电视墙号码
                $('.del_i').click(function () {
                    $('.ulTwo').hide();
                });
                //点击取消
                $('.edit-close').click(function () {
                    layer.close(o);
                });
                //点击保存电视墙数据
                $('#postTVdata').click(function () {
                    var wallName = $('#wallName').val().replace(/\s/ig, ''); //设备名称;//电视墙名称
                    var selV2Vtype = $('#selV2Vtype').val();//设置为16位还是64位
                    var V2VnumberArr = [];
                    //验证终端名称
                    if (wallName == "") {
                        layer.msg("<p style='text-align:center'>终端名称不能为空!</p>");
                        return;
                    }
                    var refuserName = /^[A-Za-z0-9\u4e00-\u9fa5_]+$/;
                    if (wallName && !refuserName.test(wallName)) {
                        layer.msg("<p style='text-align:center'>终端名称应是英文、数字、中文</p>");
                        return;
                    }
                    var numPattern = /^\d{5,11}$/;
                    var istrue = false;//用来标记填写的所有终端号码是否符合要求
                    //筛选获取显示出来的视联网号码输入框，进行值的校验
                    $('.V2Vnumber:Visible').each(function () {

                        var number = $(this).val().replace(/\s/ig, '');
                        if (number == '') {
                            layer.msg("<p style='text-align:center'>请填满所有终端号码!</p>");
                            istrue = true;
                            return;
                        } else if (!numPattern.test(number)) {
                            layer.msg("<p style='text-align:center'>存在不合法的终端号(长度5-11位的数字)</p>");
                            istrue = true;
                            return;
                        } else if (V2VnumberArr.includes(number)) {
                            layer.msg("<p style='text-align:center'>号码不能重复!</p>");
                            istrue = true;
                            return;
                        }
                        V2VnumberArr.push(number);
                    });
                    if (istrue) {
                        return;
                    }
                    var reqData = {
                        "userId": parseInt(vm.userInfoId),
                        "tvWallName": wallName,
                        "tvWallFlag64": parseInt($('#selV2Vtype').val()), //0:16位 1：64位
                        "tvWallDeviceList": V2VnumberArr.join(','),
                    };
                    $.ajax({
                        url: getbasePath('tvWallManage/createTVWall.do'),
                        type: 'post',
                        data: JSON.stringify(reqData),
                        dataType: "json",
                        contentType: "application/json;charset=UTF-8",
                        success: function (resData) {
                            console.log(resData);
                            if (resData.result) {//添加成功后，关闭弹窗，弹出提示语
                                layer.close(o);
                                layer.msg("<p style='text-align:center'>" + resData.msg + "!</p>");
                                vm.getList();
                            } else {//添加失败后，不关闭弹窗，由用户自己决定是否关闭
                                layer.msg("<p style='text-align:center'>" + resData.msg + "!</p>");
                            }
                        },
                    });
                });
            },
            /*！
            * 功能：编辑电视墙
            *time:20200611
            */
            editTVwall: function (TVdata) {
                console.log(TVdata);
                var o = layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    content: '<div class="TVbox" style="">' +
                        '<div class="TVtitle"><span class="sptit">增加电视墙</span><span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;" style="right: -10%"></a></span></div>' +
                        '<div class="TVbody">' +
                        '<UL class="TVul">' +
                        '<li class="liName"><lable>终端名称:</lable><input id="wallName" placeholder="请输入终端名称" maxlength="50"></li>' +
                        '<li class="liName"><lable> 16/ 64位:</lable><select style="width: 3.42rem;" id="selV2Vtype"><option value="1">64</option><option value="0">16</option></select></li>' +
                        '</UL>' +
                        '<laber class="v2vlab">视联网号码：</laber><span class="addUlNum">添加</span>' +
                        '<div class="listbox">' +
                        '<ul class="clearfix "><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li></ul>' +
                        '<ul class="clearfix ulTwo"><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"> <i class="del_i"></i></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li><li class="fl"><input class="V2Vnumber" placeholder="请输入视联网号码"></li></ul>' +
                        '<div class="addTVfunbox edit-function clearfix">' +
                        '<a href="javascript:;" class="edit-confirm fl" id="postTVdata">保存</a>' +
                        '<a href="javascript:;" class="edit-close fr">关闭</a>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>', //userSetting-edit  str
                    area: ['5.53rem', '5.98rem'],
                });
                $('#wallName').val(TVdata.tvWallName);
                $('#selV2Vtype').val(TVdata.tvWallFlag64);
                var tvWallDeviceArr = TVdata.tvWallDeviceList.split(',');
                if (tvWallDeviceArr.length / 8 == 2) {
                    $('.ulTwo').show();
                }

                $('.V2Vnumber:Visible').each(function (i) {
                    $(this).val(tvWallDeviceArr[i]);
                });
                //点击添加一组电视墙号码
                $('.addUlNum').click(function () {
                    $('.ulTwo').show();
                });
                //删除一组电视墙号码
                $('.del_i').click(function () {
                    $('.ulTwo').hide();
                });
                //点击取消
                $('.edit-close').click(function () {
                    layer.close(o);
                });
                //点击保存电视墙数据
                $('#postTVdata').click(function () {
                    var wallName = $('#wallName').val().replace(/\s/ig, ''); //设备名称;//电视墙名称
                    var selV2Vtype = $('#selV2Vtype').val();//设置为16位还是64位
                    var V2VnumberArr = [];
                    //验证终端名称
                    if (wallName == "") {
                        layer.msg("<p style='text-align:center'>终端名称不能为空!</p>");
                        return;
                    }
                    var refuserName = /^[A-Za-z0-9\u4e00-\u9fa5_]+$/;
                    if (wallName && !refuserName.test(wallName)) {
                        layer.msg("<p style='text-align:center'>终端名称应是英文、数字、中文</p>");
                        return;
                    }
                    var numPattern = /^\d{5,11}$/;
                    var istrue = false;//用来标记填写的所有终端号码是否符合要求
                    //筛选获取显示出来的视联网号码输入框，进行值的校验
                    $('.V2Vnumber:Visible').each(function () {

                        var number = $(this).val().replace(/\s/ig, '');
                        if (number == '') {
                            layer.msg("<p style='text-align:center'>请填满所有终端号码!</p>");
                            istrue = true;
                            return;
                        } else if (!numPattern.test(number)) {
                            layer.msg("<p style='text-align:center'>存在不合法的终端号(长度5-11位的数字)</p>");
                            istrue = true;
                            return;
                        } else if (V2VnumberArr.includes(number)) {
                            layer.msg("<p style='text-align:center'>号码不能重复!</p>");
                            istrue = true;
                            return;
                        }
                        V2VnumberArr.push(number);
                    });
                    if (istrue) {
                        return;
                    }
                    var reqData = {
                        "id": TVdata.id,
                        "userId": parseInt(vm.userInfoId),
                        "tvWallName": wallName,
                        "tvWallFlag64": parseInt($('#selV2Vtype').val()), //0:16位 1：64位
                        "tvWallDeviceList": V2VnumberArr.join(','),
                    };
                    $.ajax({
                        url: getbasePath('tvWallManage/updateTVWall.do'),
                        type: 'post',
                        data: JSON.stringify(reqData),
                        dataType: "json",
                        contentType: "application/json;charset=UTF-8",
                        success: function (resData) {
                            console.log(resData);
                            if (resData.result) {//修改成功后，关闭弹窗，弹出提示语
                                layer.close(o);
                                layer.msg("<p style='text-align:center'>" + resData.msg + "!</p>");
                                vm.getList();
                            } else {//修改失败后，不关闭弹窗，由用户自己决定是否关闭
                                layer.msg("<p style='text-align:center'>" + resData.msg + "!</p>");
                            }
                        },
                    });
                });
            },
            /*
           *  删除电视墙数据
           * */
            delTVwallData: function (data, isSingly) {
                var _this = this;
                if (data == "") {
                    layer.msg("请选择数据");
                    return
                }

                // var _this=this;
                // var jsonarray,json;
                // var delid=[];
                // if(isSingly){
                //     delid[0]=data;
                // }else{
                //     data = data.substr(0, data.length - 1); //删除最后的逗号
                //     delid = data.split(",")
                // }
                // var jsonstr="[]";
                // jsonarray = eval('('+jsonstr+')');
                // for(var i=0;i<delid.length;i++){
                //     json={id:delid[i]}
                //     jsonarray.push(json);
                // }
                // //return;
                var layerRemove = layer.open({
                    title: "确认删除",
                    content: '您确定要删除该电视墙吗？',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        $.ajax({
                            url: 'tvWallManage/deleteTVWall.do',
                            type: 'POST',
                            dataType: 'json',
                            contentType: "application/json;charset=UTF-8",
                            // data:JSON.stringify(jsonarray),
                            data: JSON.stringify(data),
                            success: function (data) {
                                if (data.result) {
                                    _this.getList();
                                }
                                layer.msg(data.msg);
                                layer.close(layerRemove);
                            },
                            error: function (data) {
                                layer.msg(data);
                            }
                        })
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            /* 获取监控树 */
            getMonitorAreaTree: function (obj, parentCode) {
                // 修改树方法
                // var obj = {
                //     action: 'home/getDataTree.do',
                //     parentCode: parentCode,
                //     platformID: vm.platformID,
                //     menuType: 1,
                //     showType: 0
                // };
                ajaxdata(obj, function (result, data) {
                    if (result) {
                        if (parentCode === 0) {
                            // vm.zTreeMonitorArea = data.organizationList;
                            vm.zTreeMonitorArea = []; // 区域监控树数据
                            data.organizationList.forEach(function (item, index) {
                                item.nocheck = true;
                                vm.zTreeMonitorArea.push(item);
                            })
                            $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, vm.zTreeMonitorArea).expandAll(false);
                        }
                    } else {
                        layer.msg(data.msg);
                    }
                });
            },
            // 获取下拉分类下拉列表（一级列表）
            getClassfyToFrom () {
                $.ajax({
                    url: '/gisPlatform/planType/list.do',
                    type: 'get',
                    success: function (res) {
                        console.log(res)
                        let { result, data } = res
                        if (result) {
                            var str = ''
                            data && data.length && data.length > 0 && data.forEach((c, i) => {
                                str += `<li title="${c.name}" class="onlyOptionYx" value="${c.id}" ><span aa="123">${c.name}</span></li>`
                                $('#classfulist').html(`<ul class="show-ul-yx"><li value="0"><span>暂不分类</span></li>${str}</ul>`)
                            })

                        } else {
                            $('#classfulist').html('<li value="0">暂不分类</li>')
                        }
                    }
                })
            },
            /* 获取标签分组监控树 */
            getMonitorLabelTree: function () {
                var obj = {
                    action: 'labelManage/getLabelTreeByPid.do?labelId=0',
                    type: 'get',
                    dataType: 'json',
                };
                ajaxdata(obj, function (result, data) {
                    if (result) {
                        var li = data.data;
                        $('#labelGroup .numGrop').text(li.length);
                        vm.zTreeMonitorLabel = [];
                        li.forEach(function (item, index) {
                            item.nocheck = true;
                            vm.zTreeMonitorLabel.push(item);
                        });
                        $.fn.zTree.init($("#treeDemo2"), vm.zTreeMonitorLabelSetting, vm.zTreeMonitorLabel).expandAll(false);
                    } else {
                        layer.msg(data.msg);
                    }
                });
            },
            /* 渲染预案弹窗 */
            initPlanDiolag: function (objData) {
                var _that = this;
                initPlanDiolag = layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shade: 0.3,
                    content: '<div id="planDiolag-y" class="planDiolag">\
                                <div class="planDiolag_title">\
                                    <span class="sptit">添加预案</span>\
                                    <a class="plan-setting-icon" href="javascript:;"></a>\
                                </div>\
                                <div class="planDiolag_container">\
                                    <ul class="nodefault" style="display: none">\
                                        <li>\
                                            <div class="left">\
                                                <label>*预案名称</label>\
                                                <input id="planDiolag_planName" placeholder="请输入预案名称，20字内" maxlength="20" />\
                                            </div>\
                                            <div class="right">\
                                                <label>*平台选择</label>\
                                                <select id="planDiolag_flag64" placeholder="请选择">\
                                                    <option value="1" selected>64位</option>\
                                                </select>\
                                            </div>\
                                        </li>\
                                        <li>\
                                            <div class="left">\
                                                <label>*播放方式</label>\
                                                <select id="planDiolag_planType" placeholder="请选择">\
                                                    <option value="3">本地播放</option>\
                                                    <option value="2">八路电视墙轮询</option>\
                                                    <option value="1">终端多画面轮询</option>\
                                                </select>\
                                            </div>\
                                            <div class="right">\
                                                <label>*时间间隔</label>\
                                                <select id="planDiolag_intervalTime" class="planDiolag_select-time" placeholder="请选择">\
                                                    <option value="15">15S</option>\
                                                    <option value="30">30S</option>\
                                                    <option value="45">45S</option>\
                                                    <option value="ZDY">自定义</option>\
                                                </select>\
                                                <input disabled id="planDiolag_intervalTime_input" class="planDiolag_input-time"\
                                                            value="15" maxlength="3" />\
                                            </div>\
                                        </li>\
                                        <li>\
                                            <div class="left">\
                                                <label>*选择播放设备</label>\
                                                <select id="planDiolag_deviceId" placeholder="请选择" disabled></select>\
                                            </div>\
                                            <div class="right">\
                                                <label>*轮询窗口</label>\
                                                <select id="planDiolag_screens" placeholder="请选择" disabled></select>\
                                            </div>\
                                        </li>\
                                        <li>\
                                            <span id="planDiolag_openTiming" class="button">\
                                                <input class="planDiolag_openTiming" value="0" style="display: none;" />\
                                            </span>\
                                            <span class="plan-date_label">自动执行预案</span>\
                                            <input disabled id="planDiolag_startTime" class="plan-setting-date" type="text" placeholder="开始时间"  autocomplete="off" />\
                                            <span class="plan-setting-heng">—</span>\
                                            <input disabled id="planDiolag_endTime" class="plan-setting-date" style="margin-left: 0;" type="text" placeholder="结束时间" autocomplete="off" />\
                                        </li>\
                                    </ul>\
                                    <ul class="defaultYx" style="margin-bottom: .4rem;">\
                                        <li>\
                                            <div class="left">\
                                                <label style="flex: none">预案名称</label>\
                                                <input id="PlanNameWX" placeholder="限20字内" maxlength="20" style="flex: 1" />\
                                            </div>\
                                        </li>\
                                        <li>\
                                            <div class="left">\
                                                <label style=\'flex: none\'>播放方式</label>\
                                                <select id="playModeAddClassfyDefault" placeholder="请选择" style="flex: 1">\
                                                    <option value="3" selected>本地播放</option>\
                                                    <option value="1">终端播放</option>\
                                                    <option value="2">电视墙播放</option>\
                                                </select>\
                                            </div>\
                                            <div class="right">\
                                                <label style="flex: none">分屏数量</label>\
                                                <select id="screenNumber" placeholder="请选择" style="flex: 1">\
                                                    <option value="1">一分屏</option>\
                                                    <option value="4">四分屏</option>\
                                                </select>\
                                            </div>\
                                        </li>\
                                        <li>\
                                            <div class="left">\
                                                <label>预案分类</label>\
                                                <div id="classfulist" style="width: 2.47rem;"></div>\
                                            </div>\
                                            <div class="right">\
                                                <select id="erjifenleiOptions" placeholder="请选择" style="flex: 1"></select>\
                                                <p @click.stop="setClassify" id="classificationSettings">分类设置</p>\
                                            </div>\
                                        </li>\
                                    </ul>\
                                    <div class="planDiolag_monitor">\
                                        <label class="nodefault" style="display: none">*轮询监控</label>\
                                        <div class="planDiolag_monitor-list">\
                                            <div class="haveSearch nodefault" style="display: none">\
                                                <div class="haveSearch_text">\
                                                    已选<span class="haveSearch_Select">0</span>条/共<span class="haveSearch_SelectCount">0</span>条\
                                                </div>\
                                                <div class="haveSearch_line">\
                                                    <input id="haveSearchInput_Num" placeholder="请输入监控名称搜索" />\
                                                    <label id="haveSearchInput_Btn">搜索</label>\
                                                </div>\
                                                <ul class="haveSearch_btn">\
                                                    <li><span id="edit_monitor">编辑</span></li>\
                                                    <li class="disabled"><span id="edit_delMonitor">删除选中</span></li>\
                                                    <li><span id="edit_clearMonitor">全部清空</span></li>\
                                                </ul>\
                                            </div>\
                                            <div class="haveSearch defaultYx" >\
                                                <div class="haveSearch_text" style="display: flex">\
                                                    <label style="margin-left: .01rem;width: 40%;padding: 0;">播放类型</label>\
                                                    <select id="addHuaMianOption" placeholder="请选择">\
                                                        <option value="1">终端画面</option>\
                                                        <option value="2">监控画面</option>\
                                                    </select>\
                                                </div>\
                                                <ul class="haveSearch_btn">\
                                                    <li><span id="haveSearch_btn_span">添加画面</span></li>\
                                                </ul>\
                                                <div class="haveSearch_line">\
                                                    <input id="editSearchInp" placeholder="请输入关键字搜索" style="width: 2.5rem;" />\
                                                    <i id="editSearchIcon" style="width: 0.19rem;height: 0.19rem;\
                                                    background: url(/gisPlatform/resource/foreground/images/gis_new_image/sousuo2.png) no-repeat;\
                                                    background-size: 0.19rem 0.19rem;display: inline-block;\
                                                    position: absolute;right: 0.3rem;top: 0.25rem;cursor: pointer;"></i>\
                                                </div>\
                                            </div>\
                                            <p class="nonListData" id="switchLabelText">暂无终端设备</p>\
                                            <div class="haveListData">\
                                                <div class="haveList-table">\
                                                    <table class="haveList-table-list">\
                                                        <thead>\
                                                        <tr>\
                                                            <th style="width: 5%;"><i class="button"></i></th>\
                                                            <th style="width: 10%;">序号</th>\
                                                            <th style="width: 20%;">监控号码</th>\
                                                            <th>监控名称</th>\
                                                            <th style="width: 25%;">操作</th>\
                                                        </tr>\
                                                        </thead>\
                                                        <tbody></tbody>\
                                                    </table>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="listbox">\
                                    <div class="addPlanfunbox edit-function clearfix">\
                                        <a href="javascript:;" class="edit-confirm fl" id="editSavePlan">保存</a>\
                                        <a href="javascript:;" class="edit-close fr" id="editClose">关闭</a>\
                                    </div>\
                                </div>\
                            </div>',
                    area: ['7.3rem', '7.28rem'],
                    move: '.sptit',
                    // shade: 0,
                    success: function () {
                        // 加载成功的时候，先对二级下拉框进行隐藏
                        $('#erjifenleiOptions').hide()
                        // 获取一级预案分类
                        _that.getClassfyToFrom()
                        $('#classfulist').click(function () {
                            $('#classfulist .show-ul-yx').toggle()
                        });
                        $('#classfulist').on('click', '.show-ul-yx li', function (event) {
                            let val = $(this).val()
                            $('#classfulist>span').remove() // 先删除再添加
                            $('#classfulist').prepend(`<span title="${$(this).find("span").html()}" idName="${$(this).attr('value')}">${$(this).find("span").html().length > 14 ? $(this).find("span").html().slice(0, 14) + '...' : $(this).find("span").html()}</span>`)
                            $.ajax({
                                url: '/gisPlatform/planType/list.do',
                                type: 'get',
                                success: function (res) {
                                    console.log(res)
                                    let { result, data } = res
                                    let str = ``
                                    if (result) {
                                        data && data.length && data.length > 0 && data.forEach(c => {
                                            if (c.id === val && c.children && c.children.length > 0) {
                                                c.children.forEach(k => {
                                                    str += `<option title="${k.name}" value="${k.id}">${k.name}</option>`
                                                    $('#erjifenleiOptions').html(`<option value="0">请选择二级分类</option>${str}`)
                                                })
                                            }
                                        })
                                        if (str.length === 0) {
                                            $('#erjifenleiOptions').val(0)
                                            $('#erjifenleiOptions').hide()
                                        } else {
                                            $('#erjifenleiOptions').show()
                                        }
                                        console.log(str.length)
                                    } else {
                                        $('#erjifenleiOptions').html('')
                                    }
                                }
                            })
                        });
                        // $('#classfulist').on('click', '.show-ul-yx li ul li' ,function (event) {
                        //     let val = $(this).val()
                        //     $('#classfulist>span').remove() // 先删除再添加
                        //     $('#classfulist').prepend(`<span idName="${$(this).attr('value')}">${$(this).find("span").html()}</span>`)
                        //     $('#classfulist .show-ul-yx').hide()
                        // });
                        $('#addHuaMianOption').change(function () {
                            // 1 终端  2 监控
                            if (+$(this).val() === 1) {
                                $('#switchLabelText').text('暂无终端设备')
                            } else {
                                $('#switchLabelText').text('暂无监控设备')
                            }
                            // 如果是编辑回显的数据，在切换的时候需要将列表数据清空
                            $('.haveList-table-list tbody').html('');
                            vm.mainSaveMonitorList = []
                        })
                        function hadCheckBox () { // 确认存在选中监控，并开放删除选中按钮
                            if (vm.mainSelectMonitorList.length != 0) {
                                $('#edit_delMonitor').parent().removeClass('disabled');
                                return;
                            }
                            $('#edit_delMonitor').parent().addClass('disabled');
                        }
                        // 重置按钮方法
                        function restTableListDataEvent () {
                            // 已选择监控列表单选按钮
                            $('.haveList-table-list tbody .button').bind('click', function () {
                                // 获取勾选元素的索引
                                var dataIndex = vm.mainSaveMonitorList.map(function (item) {
                                    return item.number;
                                }).indexOf($(this).attr('data-number'));
                                if ($(this).hasClass('check-true-focus')) {
                                    $(this).removeClass('check-true-focus');
                                    vm.mainSelectMonitorList.forEach(function (item, isIt) {
                                        if (item.number == vm.mainSaveMonitorList[dataIndex].number) {
                                            vm.mainSelectMonitorList.splice(isIt, 1);
                                        }
                                    });
                                } else {
                                    $(this).addClass('check-true-focus');
                                    // 先判断列表中是否有这个监控
                                    var isIt = vm.mainSelectMonitorList.findIndex(function (value) {
                                        return value && (value.number === vm.mainSaveMonitorList[dataIndex].number);
                                    });
                                    if (isIt > -1) {
                                        return;
                                    }
                                    vm.mainSelectMonitorList.push(vm.mainSaveMonitorList[dataIndex]);
                                }
                                if (vm.mainSelectMonitorList.length == vm.mainSaveMonitorList.length) {
                                    $('.haveList-table-list thead .button').addClass('check-true-focus');
                                } else {
                                    $('.haveList-table-list thead .button').removeClass('check-true-focus');
                                }
                                // 更新选中的监控数
                                $('.haveSearch_Select').text(JSON.stringify(vm.mainSelectMonitorList.length).length > 3 ? JSON.stringify(vm.mainSelectMonitorList.length).slice(0, 2) + '...' : vm.mainSelectMonitorList.length);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                            // 上移
                            $('.upIcon_btn').bind('click', function () {
                                console.log('上移');
                                // 获取父级索引
                                var parentIndex = $(this).parent('td').parent('tr').index();
                                if (parentIndex > 0) {
                                    var copyNode = vm.mainSaveMonitorList[parentIndex];
                                    vm.mainSaveMonitorList.splice(parentIndex, 1);
                                    vm.mainSaveMonitorList.splice(parentIndex - 1, 0, copyNode);
                                } else {
                                    layer.msg('已移动至最前');
                                    return;
                                }
                                vm.mainSelectMonitorList = [];
                                // 重置部分参数
                                restDataForTable(vm.mainSaveMonitorList);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                            // 下移
                            $('.downIcon_btn').bind('click', function () {
                                console.log('下移');
                                // 获取父级索引
                                var parentIndex = $(this).parent('td').parent('tr').index();
                                if (parentIndex < (vm.mainSaveMonitorList.length - 1)) {
                                    var copyNode = vm.mainSaveMonitorList[parentIndex];
                                    vm.mainSaveMonitorList.splice(parentIndex, 1);
                                    vm.mainSaveMonitorList.splice(parentIndex + 1, 0, copyNode);
                                } else {
                                    layer.msg('已移动至最后');
                                    return;
                                }
                                vm.mainSelectMonitorList = [];
                                // 重置部分参数
                                restDataForTable(vm.mainSaveMonitorList);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                            // 删除
                            $('.delIcon_btn').bind('click', function () {
                                console.log('删除');
                                // 获取勾选元素的索引
                                var parentIndex = vm.mainSaveMonitorList.map(function (item) {
                                    return item.number;
                                }).indexOf($(this).attr('data-number'));
                                vm.mainSaveMonitorList.splice(parentIndex, 1);
                                vm.mainSelectMonitorList = [];
                                // 重置部分参数
                                restDataForTable(vm.mainSaveMonitorList);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                        }
                        // yx 新增无锡需求，对增加或者编辑预案的时候移动的箭头进行处理
                        function haveListTableList (obj, index) {
                            let str = ''
                            if (obj.length === 1) {
                                str = '<a href=\'javascript:;\' class="downIcon_btn_gray"></a><a href=\'javascript:;\' class="upIcon_btn_gray"></a>'
                            } else {
                                if (index === 0) {
                                    str = `<a href=\'javascript:;\' class="upIcon_btn_gray"></a><a href=\'javascript:;\' class="downIcon_btn"></a>`
                                }
                                if (index === obj.length - 1) {
                                    str = `<a href=\'javascript:;\' class="upIcon_btn"></a><a href=\'javascript:;\' class="downIcon_btn_gray"></a>`
                                }
                                if (index !== 0 && index !== obj.length - 1) {
                                    str = `<a href=\'javascript:;\' class="upIcon_btn"></a><a href=\'javascript:;\' class="downIcon_btn"></a>`
                                }
                            }
                            return str
                        }
                        function restDataForTable (obj) { // 重置部分参数
                            $('.haveList-table-list thead .button').removeClass('check-true-focus');
                            $('.haveList-table-list tbody').html('');
                            obj.forEach(function (item, index) {
                                let str = haveListTableList(obj, index)
                                var html = '<tr><td><i data-number="' + item.number + '" class="button"></i></td><td>' + (index + 1) + '</td><td>' + item.number + '</td><td title="' + item.name + '">' + (item.name.length >= 10 ? item.name.slice(0, 10) + "..." : item.name) + '</td><td>' + str + '<a href=\'javascript:;\' data-number="' + item.number + '" class="delIcon_btn"></a></td></tr>';
                                $('.haveList-table-list tbody').append(html);
                            });
                            // 重置按钮方法
                            restTableListDataEvent();
                            // 更新选中的监控数
                            $('.haveSearch_Select').text(vm.mainSelectMonitorList.length > 3 ? JSON.stringify(vm.mainSelectMonitorList.length).slice(0, 2) + '...' : vm.mainSelectMonitorList.length);
                            // 更新创建弹窗中对的监控总数
                            $('.haveSearch_SelectCount').text(JSON.stringify(vm.mainSaveMonitorList.length).length > 3 ? JSON.stringify(vm.mainSaveMonitorList.length).slice(0, 2) + '...' : vm.mainSaveMonitorList.length);
                            if (vm.mainSaveMonitorList.length == 0) {
                                // 显示无数据
                                $('.nonListData').show();
                                $('.haveListData').hide();
                            } else {
                                // 隐藏无数据
                                $('.nonListData').hide();
                                $('.haveListData').show();
                            }
                        }
                        function _queryTerminalList (type, terminalData) { // 获取终端播放或电视墙常用设备
                            console.log('弹窗成功的函数 内层函数 _queryTerminalList')
                            // 此处最外层的判断是为了本地播放的时候，不需要获取当前常用的设备接口
                            if ($('#playModeAddClassfyDefault').val() !== '3' && $('#playModeAddClassfyDefault').val() !== 3) {
                                if (parseInt(type) == 1) {
                                    var params = {
                                        action: 'device/getOftenList.do',
                                        userId: $("#username").val(),
                                        pageNum: -1
                                    };
                                    // 同时打开轮询窗口的数量选择限制
                                    var str = '<option value="1">1画面</option><option value="4" selected>4画面</option>' +
                                        '<option value="9">9画面</option><option value="16">16画面</option>';
                                    $("#planDiolag_screens").html(str);
                                    $("#planDiolag_screens").prop('disabled', false);
                                } else {
                                    var userId = $("#username").val();
                                    var params = {
                                        action: 'tvWallManage/selectTVWallList.do',
                                        type: 'GET',
                                        userId: userId,
                                        pageNum: 1,
                                        pageSize: 99999
                                    };
                                    // 同时打开轮询窗口的数量选择限制
                                    var str = '<option value="8" selected>8画面</option><option value="16">16画面</option>';
                                    $("#planDiolag_screens").html(str);
                                    $("#planDiolag_screens").prop('disabled', false);
                                }
                                ajaxdata(params, function (result, data) {
                                    if (result) {
                                        if (data.list.list.length != 0) {
                                            var str = '';
                                            data.list.list.forEach(function (v) {
                                                if (parseInt(type) == 1) {
                                                    str += '<option data-type="' + v.type + '" value="' + v.id + '" title="' + v.name + '-' + v.number + '">' + (v.name.length > 18 ? v.name.slice(0, 18) + '...' : v.name) + '</option>';
                                                } else {
                                                    str += '<option data-sreens="' + v.tvWallDeviceList.split(',').length + '" value="' + v.id + '">' + (v.tvWallName.length > 18 ? v.tvWallName.slice(0, 18) + '...' : v.tvWallName) + '</option>';
                                                }
                                            });
                                            $("#planDiolag_deviceId").html(str);
                                            $("#planDiolag_deviceId").prop('disabled', false);
                                            // 如果存在数据，则是编辑操作，需要回显数据
                                            if (terminalData) {
                                                if (terminalData.plan[0].planType == 1) {
                                                    $('#planDiolag_deviceId').val(terminalData.plan[0].deviceId);
                                                } else {
                                                    $('#planDiolag_deviceId').val(terminalData.plan[0].tvWallId);
                                                }
                                                $('#planDiolag_screens').val(terminalData.plan[0].screens);
                                            }
                                        } else {
                                            layer.msg('您当前未设置常用设备');
                                        }
                                    }
                                });
                            }

                        }
                        // 初始化点击事件
                        function _initDiolagEvent () {
                            // 监听预案名字的输入
                            // $('#planDiolag_planName').bind('input propertychange',function () {
                            //     var planDiolag_planName = $(this).val();
                            //     // 判断是否是特殊符号
                            //     var reg = /[\s+`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g;
                            //     if(reg.test(planDiolag_planName)) {
                            //         planDiolag_planName = $(this).val().replace(/[\s+`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '');
                            //         $(this).val(planDiolag_planName);
                            //         layer.msg('仅支持输入中英文和数字，不支持输入符号');
                            //     }
                            // });
                            // 选中预案类型后获取对应常用终端和可设置画面
                            $("#planDiolag_planType").change(function () {
                                console.log('切换')
                                // 如果是编辑回显的数据，在切换的时候需要将列表数据清空
                                $('.haveList-table-list tbody').html('');
                                vm.mainSaveMonitorList = []
                                if ($(this).val() === '3') {
                                    if (+$('#addHuaMianOption').val() === 1) {
                                        $('#switchLabelText').text('暂无终端设备')
                                    } else {
                                        $('#switchLabelText').text('暂无监控设备')
                                    }
                                    $('.nodefault').hide()
                                    $('.defaultYx').show()
                                    $('#playModeAddClassfyDefault').val($(this).val())
                                }
                                $("#planDiolag_deviceId").prop('disabled', true).html('').val('');
                                // 获取预案类型常用设备
                                _queryTerminalList($(this).val());
                            });
                            // 选中预案自动执行
                            $('#planDiolag_openTiming').click(function () {
                                if ($(this).hasClass('check-true-focus')) {
                                    $(this).removeClass('check-true-focus');
                                    $('.planDiolag_openTiming').val('0');
                                    // 置灰日期选择框
                                    $('#planDiolag_startTime').prop('disabled', true);
                                    $('#planDiolag_endTime').prop('disabled', true);
                                    // 置空已选日期
                                    // $('#planDiolag_startTime').val('');
                                    // $('#planDiolag_endTime').val('');
                                } else {
                                    $(this).addClass('check-true-focus');
                                    $('.planDiolag_openTiming').val('1');
                                    // 开放日期选择框
                                    $('#planDiolag_startTime').prop('disabled', false);
                                    $('#planDiolag_endTime').prop('disabled', false);
                                }
                            });
                            // 日期控件起始时间
                            $('#planDiolag_startTime').bind('click', function () {
                                var now = today();
                                console.log($(this));
                                WdatePicker({
                                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                                    errDealMode: -1, //禁用自动纠错功能（浏览器自带弹窗会阻止websocket）
                                    minDate: '#F{$dp.$DV(\'' + now + '\');}',
                                    // minDate: '#F{$dp.$DV(\'' + now + '\');}',
                                    // maxDate: '#F{$dp.$D(\'planDiolag_endTime\');}',
                                    readOnly: true,
                                    onpicked: function () {
                                        console.log(1);
                                    }
                                });
                            });
                            // 日期控件结束时间
                            $('#planDiolag_endTime').bind('click', function () {
                                var now = today();
                                WdatePicker({
                                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                                    errDealMode: -1, //禁用自动纠错功能（浏览器自带弹窗会阻止websocket）
                                    minDate: '#F{$dp.$D(\'planDiolag_startTime\')||$dp.$DV(\'' + now + '\');}',
                                    readOnly: true,
                                    onpicked: function () {
                                        console.log(2);
                                    }
                                });
                            });
                            // 选中轮询时间间隔
                            $("#planDiolag_intervalTime").change(function () {
                                if ($(this).val() == 'ZDY') {
                                    // 放开时间输入框
                                    $('#planDiolag_intervalTime_input').prop('disabled', false);
                                    // 重置时间展示框
                                    $('#planDiolag_intervalTime_input').val(0);
                                } else {
                                    // 置灰时间输入框
                                    $('#planDiolag_intervalTime_input').prop('disabled', true);
                                    // 变更时间展示框
                                    $('#planDiolag_intervalTime_input').val($(this).val());
                                }
                            });
                            // 监听已选监控列表输入框的变化
                            $('#haveSearchInput_Num').bind('input propertychange', function () {
                                var searchName = $(this).val();
                                if (!searchName) {
                                    // 清空部分选项
                                    $('.right-monitor-list tbody').html('');
                                    vm.mainSelectMonitorList = [];
                                    // 重置部分参数
                                    restDataForTable(vm.mainSaveMonitorList);
                                    // 确定是否有选中，展示或置灰删除选中按钮
                                    hadCheckBox();
                                    return;
                                }
                            });
                            // 已选监控列表筛选
                            $('#haveSearchInput_Btn').click(function () {
                                console.log('已选监控列表筛选');
                                var searchName = $('#haveSearchInput_Num').val();
                                if (!searchName) {
                                    // 清空部分选项
                                    $('.right-monitor-list tbody').html('');
                                    vm.mainSelectMonitorList = [];
                                    // 重置部分参数
                                    restDataForTable(vm.mainSaveMonitorList);
                                    // 确定是否有选中，展示或置灰删除选中按钮
                                    hadCheckBox();
                                    return;
                                }
                                var selectArray = [];
                                vm.mainSaveMonitorList.forEach(function (item) {
                                    if (item.name.indexOf(searchName) > -1) {
                                        selectArray.push(item);
                                    }
                                });
                                vm.mainSelectMonitorList = [];
                                // 重置部分参数
                                restDataForTable(selectArray);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                            // 无锡新增 编辑后icon搜索
                            $('#editSearchIcon').click(function () {
                                console.log('已选监控列表筛选');
                                var searchName = $('#editSearchInp').val();
                                if (!searchName) {
                                    // 清空部分选项
                                    $('.right-monitor-list tbody').html('');
                                    vm.mainSelectMonitorList = [];
                                    // 重置部分参数
                                    restDataForTable(vm.mainSaveMonitorList);
                                    // 确定是否有选中，展示或置灰删除选中按钮
                                    hadCheckBox();
                                    return;
                                }
                                var selectArray = [];
                                vm.mainSaveMonitorList.forEach(function (item) {
                                    if (item.name.indexOf(searchName) > -1) {
                                        selectArray.push(item);
                                    }
                                });
                                vm.mainSelectMonitorList = [];
                                // 重置部分参数
                                restDataForTable(selectArray);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                            // 编辑监控
                            $('#edit_monitor').click(function () {
                                console.log('编辑监控');
                                let editIndex = layer.open({
                                    type: 1,
                                    title: false,
                                    closeBtn: 0,
                                    shade: 0.3,
                                    content: '<div class="transfer-diolag">' +
                                        '<div class="transferDiolag_title"><span class="sptit">监控选择</span><a class="plan-setting-icon" href="javascript:;"></a></span></div>' +
                                        '<div class="transferDiolag_container">' +
                                        '<div class="left"><div class="left-headLine"><div class="left-headLine-count">已选择<span class="leftMonitorSelect">0</span>条</div><div class="left-headLine-search"><input id="leftSearchNum" placeholder="请输入监控名称搜索"/><label id="leftSearchBtn"></label></div></div>' +
                                        '<ul id="accordion" class="accordion"><li><div class="link"><i class="fa fa-leaf"></i>行政区域<i class="fa fa-chevron-down"></i></div><ul id="treeDemo1" class="submenu ztree monTree"></ul></li>' +
                                        '<li><div class="link" id="labelGroup"><i class="fa fa-shopping-cart"></i>标签分组(<span class="numGrop"></span>)<i class="fa fa-chevron-down"></i></div><ul id="treeDemo2" class="submenu ztree monTree"></ul></li>' +
                                        '</ul>' +
                                        '</div>' +
                                        '<ul class="mid"><li><a href="javascript:;" id="saveCheckMonitor">添加</a></li><li><a href="javascript:;" id="delCheckMonitor">删除</a></li></ul>' +
                                        '<div class="right"><h3>自定义预案-已选择监控列表</h3><div class="right-headLine"><div class="right-headLine-count">已选择<span class="rightMonitorSelect">0</span>条/共<span class="rightMonitorCount">0</span>条监控</div><div class="right-headLine-search"><input id="rightSearchNum" placeholder="请输入监控名称搜索"/><label id="rightSearchBtn"></label></div></div>' +
                                        '<div class="right-table-list"><div style="padding-right: 0px"><table class="right-monitor-list"><colgroup><col style="width: 15%" /><col style="width: 15%" /><col style="width: 70%" /></colgroup><thead><tr><th style="width: 15%;"><i class="button"></i></th><th style="width: 15%;">序号</th><th style="width: 70%;">监控名称</th></tr></thead></table></div>' +
                                        '<div style="height: 4.2rem; overflow-y: auto;"><table class="right-monitor-list"><colgroup><col style="width: 15%" /><col style="width: 15%" /><col style="width: 70%" /></colgroup><tbody></tbody></table></div></div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="listbox">' +
                                        '<div class="addPlanfunbox edit-function clearfix">' +
                                        '<a href="javascript:;" class="edit-confirm fl" id="editMonitorSave">保存</a>' +
                                        '<a href="javascript:;" class="edit-close fr" id="editMonitorClose">关闭</a>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>',
                                    area: ['10.82rem', '7.88rem'],
                                    move: '.sptit',
                                    success: function () {
                                        // 加载弹窗
                                        selectMonitorLoad = null;
                                        function addSelectMonitor (obj, index) { // 往选中列表中添加监控
                                            obj.forEach(function (item, i) {
                                                var html = '<tr><td><i data-number="' + item.number + '" class="button"></i></td><td>' + (index + i + 1) + '</td><td title="' + item.name + '">' + (item.name.length >= 20 ? item.name.slice(0, 20) + "..." : item.name) + '</td></tr>';
                                                $('.right-monitor-list tbody').append(html);
                                            });
                                            // 更新总数
                                            $('.rightMonitorCount').text(vm.subSaveMonitorList.length);
                                            // 关闭加载弹窗
                                            layer.close(selectMonitorLoad);

                                            // 已选择监控列表单选按钮
                                            $('.right-monitor-list tbody .button').click(function () {
                                                // 获取勾选元素的索引
                                                var dataIndex = vm.subSaveMonitorList.map(function (item) {
                                                    return item.number;
                                                }).indexOf($(this).attr('data-number'));
                                                if ($(this).hasClass('check-true-focus')) {
                                                    $(this).removeClass('check-true-focus');
                                                    vm.subSelectMonitorList.forEach(function (item, isIt) {
                                                        if (item.number == vm.subSaveMonitorList[dataIndex].number) {
                                                            vm.subSelectMonitorList.splice(isIt, 1);
                                                        }
                                                    });
                                                } else {
                                                    $(this).addClass('check-true-focus');
                                                    // 先判断列表中是否有这个监控
                                                    var isIt = vm.subSelectMonitorList.findIndex(function (value) {
                                                        return value && (value.number === vm.subSaveMonitorList[dataIndex].number);
                                                    });
                                                    if (isIt > -1) {
                                                        return;
                                                    }
                                                    vm.subSelectMonitorList.push(vm.subSaveMonitorList[dataIndex]);
                                                }
                                                if (vm.subSelectMonitorList.length == vm.subSaveMonitorList.length) {
                                                    $('.right-monitor-list thead .button').addClass('check-true-focus');
                                                } else {
                                                    $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                }
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                            });
                                        }
                                        // 初始化弹窗方法
                                        function _initEvent () {
                                            // 获取监控树
                                            let obj = {
                                                action: 'home/getDataTree.do',
                                                parentCode: 0,
                                                platformID: vm.platformID,
                                            };
                                            _that.getMonitorAreaTree(obj, 0);
                                            _that.getMonitorLabelTree();
                                            // 手风琴效果
                                            var accordion = new Accordion($('#accordion'), false);
                                            $('.accordion .link').eq(0).click();
                                            $('.submenu li').click(function () {
                                                $(this).addClass('current').siblings('li').removeClass('current');
                                            });
                                            // 加载已经选中的监控列表
                                            if (vm.mainSaveMonitorList) {
                                                vm.mainSaveMonitorList.forEach(function (item) {
                                                    vm.subSaveMonitorList.push(item);
                                                });
                                                addSelectMonitor(vm.subSaveMonitorList, 0);
                                            }

                                            // 监听监控列表输入框的变化
                                            $('#leftSearchNum').bind('input propertychange', function () {
                                                vm.searchName = $(this).val();
                                                if (!vm.searchName) {
                                                    $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, vm.copyNode).expandAll(false);
                                                    vm.selIsItemId = null;
                                                    return;
                                                }
                                            });
                                            // 监控列表筛选
                                            $('#leftSearchBtn').click(function () {
                                                console.log('监控列表筛选');
                                                vm.searchName = $('#leftSearchNum').val();
                                                if (!vm.searchName) {
                                                    $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, vm.copyNode).expandAll(false);
                                                    vm.selIsItemId = null;
                                                    return;
                                                }
                                                var obj = {
                                                    // action: 'home/searchDataTree.do',
                                                    action: 'home/searchNewGisList.do',
                                                    param: vm.searchName,
                                                    parentCode: vm.selIsItemId,
                                                    menuType: '2'
                                                };
                                                if (vm.num === 1) {
                                                    vm.copyNode = vm.zTreeMonitorArea;
                                                }
                                                vm.num = 0;
                                                ajaxdata(obj, function (result, data) {
                                                    if (result) {
                                                        if (data && data.list && data.list.list.length) {
                                                            vm.zTreeMonitorArea = list.list;
                                                            $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, data.masters).expandAll(false);
                                                            if (!$('.accordion li').eq(0).hasClass('open')) {
                                                                $('.accordion .link').eq(0).click();
                                                            }
                                                        } else {
                                                            layer.msg('未搜索到结果');
                                                        }
                                                    } else {
                                                        layer.msg(data.msg);
                                                    }
                                                });
                                            });
                                            // 监听已选监控输入框的变化
                                            $('#rightSearchNum').bind('input propertychange', function () {
                                                var searchName = $(this).val();
                                                if (!searchName) {
                                                    // 清空部分选项
                                                    $('.right-monitor-list tbody').html('');
                                                    addSelectMonitor(vm.subSaveMonitorList, 0);
                                                    // 更新选中的监控数
                                                    $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                    vm.subSelectMonitorList = [];
                                                    $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                    return;
                                                }
                                            });
                                            // 已选监控列表筛选
                                            $('#rightSearchBtn').click(function () {
                                                console.log('已选监控列表筛选');
                                                var searchName = $('#rightSearchNum').val();
                                                if (!searchName) {
                                                    // 清空部分选项
                                                    $('.right-monitor-list tbody').html('');
                                                    addSelectMonitor(vm.subSaveMonitorList, 0);
                                                    // 更新选中的监控数
                                                    $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                    vm.subSelectMonitorList = [];
                                                    $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                    return;
                                                }
                                                var selectArray = [];
                                                vm.subSaveMonitorList.forEach(function (item) {
                                                    if (item.name.indexOf(searchName) > -1) {
                                                        selectArray.push(item);
                                                    }
                                                });
                                                // 清空部分选项
                                                $('.right-monitor-list tbody').html('');
                                                addSelectMonitor(selectArray, 0);
                                                // 更新选中的监控数
                                                $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                vm.subSelectMonitorList = [];
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                            });
                                            // 添加按钮
                                            $('#saveCheckMonitor').click(function () {
                                                console.log('保存已选中监控');
                                                // 添加加载动效
                                                selectMonitorLoad = layer.load();
                                                // 如果监控树还未初始化时，会报getCheckedNodes = undefined的错误，这里做个规避
                                                var ztreeMonitorState = $.fn.zTree.getZTreeObj('treeDemo1');
                                                if (!ztreeMonitorState) {
                                                    // 给予提示
                                                    layer.msg('未选择监控点位');
                                                    // 关闭加载弹窗
                                                    layer.close(selectMonitorLoad);
                                                    return false;
                                                }
                                                // 获取行政区域所有勾选的节点
                                                var checkedTree1Node = $.fn.zTree.getZTreeObj('treeDemo1').getCheckedNodes(true);
                                                // 获取所有标签分组被勾选的节点
                                                var checkedTree2Node = $.fn.zTree.getZTreeObj('treeDemo2').getCheckedNodes(true);
                                                var commNode = [];
                                                checkedTree1Node.forEach(function (item, index) {
                                                    if (!item.isParent && item.checked) {
                                                        commNode.push(item);
                                                    }
                                                });
                                                checkedTree2Node.forEach(function (item, index) {
                                                    if (!item.isParent && item.checked) {
                                                        commNode.push(item);
                                                    }
                                                });
                                                // 如果没有勾选监控点位，则不必往下执行
                                                if (commNode.length == 0) {
                                                    // 给予提示
                                                    layer.msg('未选择监控点位');
                                                    // 关闭加载弹窗
                                                    layer.close(selectMonitorLoad);
                                                    return false;
                                                }
                                                // 将获得的监控添加进入已选列表
                                                if (vm.subSaveMonitorList.length == 0) {
                                                    vm.subSaveMonitorList = commNode;
                                                    // 加载已经选中的监控列表
                                                    addSelectMonitor(vm.subSaveMonitorList, 0);
                                                } else {
                                                    var toAppendList = [];
                                                    var lastIndex = vm.subSaveMonitorList.length;
                                                    var hadSaveMonitorState = false; // 判断是否存在已保存的数据
                                                    commNode.forEach(function (item, index) {
                                                        var index = true;
                                                        vm.subSaveMonitorList.forEach(function (item1, index1) {
                                                            if (item.number == item1.number) {
                                                                index = false;
                                                                // 设置判断为真
                                                                hadSaveMonitorState = true;
                                                            }
                                                        })
                                                        if (index) {
                                                            vm.subSaveMonitorList.push(item);
                                                            toAppendList.push(item);
                                                        }
                                                    });
                                                    // 加载已经选中的监控列表
                                                    if (toAppendList.length != 0) {
                                                        addSelectMonitor(toAppendList, lastIndex)
                                                    };
                                                    if (hadSaveMonitorState) {
                                                        layer.msg('部分监控已添加至列表');
                                                        // 关闭加载弹窗
                                                        layer.close(selectMonitorLoad);
                                                    };
                                                }
                                            });
                                            // 删除按钮
                                            $('#delCheckMonitor').click(function () {
                                                console.log('删除已选中监控');
                                                // 添加加载动效
                                                selectMonitorLoad = layer.load();
                                                var list1 = vm.subSelectMonitorList;
                                                var list2 = vm.subSaveMonitorList;
                                                var newArray = list2.filter(function (item) {
                                                    if (!list1.includes(item)) return item;
                                                });
                                                vm.subSaveMonitorList = newArray;
                                                // 清空部分选项
                                                $('.right-monitor-list tbody').html('');
                                                vm.subSelectMonitorList = [];
                                                $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                addSelectMonitor(vm.subSaveMonitorList, 0);
                                            });
                                            // 保存按钮
                                            $('#editMonitorSave').click(function () {
                                                // 清空已保存监控列表
                                                vm.mainSaveMonitorList = [];
                                                $('.haveList-table-list tbody').html('');
                                                if (vm.subSaveMonitorList.length != 0) {
                                                    vm.subSaveMonitorList.forEach(function (item, index) {
                                                        let str = haveListTableList(vm.subSaveMonitorList, index)
                                                        var html = '<tr><td><i data-number="' + item.number + '" class="button"></i></td><td>' + (index + 1) + '</td><td>' + item.number + '</td><td title="' + item.name + '">' + (item.name.length >= 10 ? item.name.slice(0, 10) + "..." : item.name) + '</td><td>' + str + '<a href=\'javascript:;\' data-number="' + item.number + '" class="delIcon_btn"></a></td></tr>';
                                                        $('.haveList-table-list tbody').append(html);
                                                        vm.mainSaveMonitorList.push(item);
                                                    });
                                                    // 重置按钮方法
                                                    restTableListDataEvent();
                                                    // 隐藏无数据
                                                    $('.nonListData').hide();
                                                    $('.haveListData').show();
                                                } else {
                                                    // 显示无数据
                                                    $('.nonListData').show();
                                                    $('.haveListData').hide();
                                                }
                                                // 更新创建弹窗中对的监控总数
                                                $('.haveSearch_SelectCount').text(JSON.stringify(vm.mainSaveMonitorList.length).length > 3 ? JSON.stringify(vm.mainSaveMonitorList.length).slice(0, 2) + '...' : vm.mainSaveMonitorList.length);
                                                vm.subSaveMonitorList = [];
                                                vm.subSelectMonitorList = [];
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                layer.close(editIndex);
                                            });
                                            // 取消保存按钮
                                            $('#editMonitorClose').click(function () {
                                                vm.subSaveMonitorList = [];
                                                vm.subSelectMonitorList = [];
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                layer.close(editIndex);
                                            });
                                            // 关闭按钮
                                            $('.transfer-diolag .transferDiolag_title .plan-setting-icon').click(function () {
                                                vm.subSaveMonitorList = [];
                                                vm.subSelectMonitorList = [];
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                layer.close(editIndex);
                                            });
                                            // 已选择监控列表全选按钮
                                            $('.right-monitor-list thead .button').click(function () {
                                                if ($(this).hasClass('check-true-focus')) {
                                                    $(this).removeClass('check-true-focus');
                                                    $('.right-monitor-list tbody .button').removeClass('check-true-focus');
                                                    vm.subSelectMonitorList = [];
                                                } else {
                                                    vm.subSelectMonitorList = [];
                                                    $(this).addClass('check-true-focus');
                                                    $('.right-monitor-list tbody .button').addClass('check-true-focus');
                                                    vm.subSaveMonitorList.forEach(function (item) {
                                                        vm.subSelectMonitorList.push(item);
                                                    });
                                                }
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                            });
                                        }
                                        // 初始化弹窗方法
                                        _initEvent();
                                    }
                                });
                            });
                            // 新增无锡需求编辑监控
                            $('#haveSearch_btn_span').click(function () {
                                console.log('编辑监控,无锡新增');
                                let editIndex = layer.open({
                                    type: 1,
                                    title: false,
                                    closeBtn: 0,
                                    shade: 0.3,
                                    content: '<div class="transfer-diolag">' +
                                        '<div class="transferDiolag_title"><span class="sptit">添加画面</span><a class="plan-setting-icon" href="javascript:;"></a></span></div>' +
                                        '<div class="transferDiolag_container">' +
                                        '<div class="left"><div class="left-headLine"><div class="left-headLine-count">已选择<span class="leftMonitorSelect">0</span>条</div><div class="left-headLine-search"><input id="leftSearchNum" placeholder="请输入关键字搜索"/><label id="leftSearchBtn"></label></div></div>' +
                                        '<ul id="accordion" class="accordion"><li><div class="link"><i class="fa fa-leaf"></i>行政区域<i class="fa fa-chevron-down"></i></div><ul id="treeDemo1" class="submenu ztree monTree"></ul></li>' +
                                        '<li><div class="link" id="labelGroup"><i class="fa fa-shopping-cart"></i>标签分组(<span class="numGrop"></span>)<i class="fa fa-chevron-down"></i></div><ul id="treeDemo2" class="submenu ztree monTree"></ul></li>' +
                                        '</ul>' +
                                        '</div>' +
                                        '<ul class="mid"><li><a href="javascript:;" id="saveCheckMonitor">添加</a></li><li><a href="javascript:;" id="delCheckMonitor">删除</a></li></ul>' +
                                        '<div class="right"><h3>预案列表</h3><div class="right-headLine"><div class="right-headLine-count">共<span class="rightMonitorCount">0</span>条</div><div class="right-headLine-search"><input id="rightSearchNum" placeholder="请输入关键字搜索"/><label id="rightSearchBtn"></label></div></div>' +
                                        '<div class="right-table-list"><div style="padding-right: 0px"><table class="right-monitor-list"><colgroup><col style="width: 15%" /><col style="width: 15%" /><col style="width: 70%" /></colgroup><thead><tr><th style="width: 15%;"><i class="button"></i></th><th style="width: 15%;">序号</th><th style="width: 70%;"><span id="monitoringName">监控名称</span></th></tr></thead></table></div>' +
                                        '<div style="height: 4.2rem; overflow-y: auto;"><table class="right-monitor-list"><colgroup><col style="width: 15%" /><col style="width: 15%" /><col style="width: 70%" /></colgroup><tbody></tbody></table></div></div>' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="listbox">' +
                                        '<div class="addPlanfunbox edit-function clearfix">' +
                                        '<a href="javascript:;" class="edit-confirm fl" id="editMonitorSave">保存</a>' +
                                        '<a href="javascript:;" class="edit-close fr" id="editMonitorClose">关闭</a>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>',
                                    area: ['10.82rem', '7.88rem'],
                                    move: '.sptit',
                                    success: function () {
                                        // 加载弹窗
                                        selectMonitorLoad = null;
                                        function addSelectMonitor (obj, index) { // 往选中列表中添加监控
                                            obj.forEach(function (item, i) {
                                                var html = '<tr><td><i data-number="' + item.number + '" class="button"></i></td><td>' + (index + i + 1) + '</td><td title="' + item.name + '">' + (item.name.length >= 20 ? item.name.slice(0, 20) + "..." : item.name) + '</td></tr>';
                                                $('.right-monitor-list tbody').append(html);
                                            });
                                            // 更新总数
                                            $('.rightMonitorCount').text(vm.subSaveMonitorList.length);
                                            // 关闭加载弹窗
                                            layer.close(selectMonitorLoad);

                                            // 已选择监控列表单选按钮
                                            $('.right-monitor-list tbody .button').click(function () {
                                                // 获取勾选元素的索引
                                                var dataIndex = vm.subSaveMonitorList.map(function (item) {
                                                    return item.number;
                                                }).indexOf($(this).attr('data-number'));
                                                if ($(this).hasClass('check-true-focus')) {
                                                    $(this).removeClass('check-true-focus');
                                                    vm.subSelectMonitorList.forEach(function (item, isIt) {
                                                        if (item.number == vm.subSaveMonitorList[dataIndex].number) {
                                                            vm.subSelectMonitorList.splice(isIt, 1);
                                                        }
                                                    });
                                                } else {
                                                    $(this).addClass('check-true-focus');
                                                    // 先判断列表中是否有这个监控
                                                    var isIt = vm.subSelectMonitorList.findIndex(function (value) {
                                                        return value && (value.number === vm.subSaveMonitorList[dataIndex].number);
                                                    });
                                                    if (isIt > -1) {
                                                        return;
                                                    }
                                                    vm.subSelectMonitorList.push(vm.subSaveMonitorList[dataIndex]);
                                                }
                                                if (vm.subSelectMonitorList.length == vm.subSaveMonitorList.length) {
                                                    $('.right-monitor-list thead .button').addClass('check-true-focus');
                                                } else {
                                                    $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                }
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                            });
                                        }
                                        // 初始化弹窗方法
                                        function _initEvent () {
                                            //<option value="1">终端画面(启明2)</option>
                                            //option value="2">监控画面</option>
                                            let obj = {}
                                            let val = $("#addHuaMianOption").val() // 获取播放类型 string yuexin
                                            if (val === 1 || val === '1') {
                                                obj = {
                                                    action: 'home/getDataTree.do',
                                                    parentCode: 0,
                                                    platformID: vm.platformID,
                                                    menuType: 1,
                                                    showType: 0,
                                                };
                                                $('#labelGroup').hide() // 隐藏标签，此处不需要标签
                                                $('#monitoringName').text('终端名称')
                                            } else {
                                                obj = {
                                                    action: 'home/getDataTree.do',
                                                    parentCode: 0,
                                                    platformID: vm.platformID,
                                                }
                                                $('#monitoringName').text('监控名称')
                                                _that.getMonitorLabelTree();
                                            }
                                            // 获取监控树
                                            _that.getMonitorAreaTree(obj, 0);
                                            // 手风琴效果
                                            var accordion = new Accordion($('#accordion'), false);
                                            $('.accordion .link').eq(0).click();
                                            $('.submenu li').click(function () {
                                                $(this).addClass('current').siblings('li').removeClass('current');
                                            });
                                            // 加载已经选中的监控列表
                                            if (vm.mainSaveMonitorList) {
                                                vm.mainSaveMonitorList.forEach(function (item) {
                                                    vm.subSaveMonitorList.push(item);
                                                });
                                                addSelectMonitor(vm.subSaveMonitorList, 0);
                                            }

                                            // 监听监控列表输入框的变化
                                            $('#leftSearchNum').bind('input propertychange', function () {
                                                vm.searchName = $(this).val();
                                                if (!vm.searchName) {
                                                    $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, vm.copyNode).expandAll(false);
                                                    vm.selIsItemId = null;
                                                    return;
                                                }
                                            });
                                            // 监控列表筛选
                                            $('#leftSearchBtn').click(function () {
                                                console.log('监控列表筛选');
                                                let inpVal = $('#addHuaMianOption').val()
                                                vm.searchName = $('#leftSearchNum').val();
                                                if (!vm.searchName) {
                                                    $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, vm.copyNode).expandAll(false);
                                                    vm.selIsItemId = null;
                                                    return;
                                                }
                                                var obj = {
                                                    // action: 'home/searchDataTree.do',
                                                    action: 'home/searchNewGisList.do',
                                                    parentCode: vm.selIsItemId,
                                                    param: vm.searchName,
                                                    menuType: inpVal === '1' ? '1' : '2',
                                                };
                                                if (vm.num === 1) {
                                                    vm.copyNode = vm.zTreeMonitorArea;
                                                }
                                                vm.num = 0;
                                                ajaxdata(obj, function (result, data) {
                                                    if (result) {
                                                        if (data && data.list && data.list.list.length) {
                                                            vm.zTreeMonitorArea = data.list.list;
                                                            $.fn.zTree.init($("#treeDemo1"), vm.zTreeMonitorAreaSetting, data.list.list).expandAll(false);
                                                            if (!$('.accordion li').eq(0).hasClass('open')) {
                                                                $('.accordion .link').eq(0).click();
                                                            }
                                                        } else {
                                                            layer.msg('未搜索到结果');
                                                        }
                                                    } else {
                                                        layer.msg(data.msg);
                                                    }
                                                });
                                            });
                                            // 监听已选监控输入框的变化
                                            $('#rightSearchNum').bind('input propertychange', function () {
                                                var searchName = $(this).val();
                                                if (!searchName) {
                                                    // 清空部分选项
                                                    $('.right-monitor-list tbody').html('');
                                                    addSelectMonitor(vm.subSaveMonitorList, 0);
                                                    // 更新选中的监控数
                                                    $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                    vm.subSelectMonitorList = [];
                                                    $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                    return;
                                                }
                                            });
                                            // 已选监控列表筛选
                                            $('#rightSearchBtn').click(function () {
                                                console.log('已选监控列表筛选');
                                                var searchName = $('#rightSearchNum').val();
                                                if (!searchName) {
                                                    // 清空部分选项
                                                    $('.right-monitor-list tbody').html('');
                                                    addSelectMonitor(vm.subSaveMonitorList, 0);
                                                    // 更新选中的监控数
                                                    $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                    vm.subSelectMonitorList = [];
                                                    $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                    return;
                                                }
                                                var selectArray = [];
                                                vm.subSaveMonitorList.forEach(function (item) {
                                                    if (item.name.indexOf(searchName) > -1) {
                                                        selectArray.push(item);
                                                    }
                                                });
                                                // 清空部分选项
                                                $('.right-monitor-list tbody').html('');
                                                addSelectMonitor(selectArray, 0);
                                                // 更新选中的监控数
                                                $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                vm.subSelectMonitorList = [];
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                            });
                                            // 添加按钮
                                            $('#saveCheckMonitor').click(function () {
                                                console.log('保存已选中监控');
                                                // 添加加载动效
                                                selectMonitorLoad = layer.load();
                                                // 如果监控树还未初始化时，会报getCheckedNodes = undefined的错误，这里做个规避
                                                var ztreeMonitorState = $.fn.zTree.getZTreeObj('treeDemo1');
                                                if (!ztreeMonitorState) {
                                                    // 给予提示
                                                    layer.msg('未选择监控点位');
                                                    // 关闭加载弹窗
                                                    layer.close(selectMonitorLoad);
                                                    return false;
                                                }
                                                // 获取行政区域所有勾选的节点
                                                var checkedTree1Node = $.fn.zTree.getZTreeObj('treeDemo1').getCheckedNodes(true);
                                                // 获取所有标签分组被勾选的节点
                                                if ($("#addHuaMianOption").val() === '2') {
                                                    var checkedTree2Node = $.fn.zTree.getZTreeObj('treeDemo2').getCheckedNodes(true)
                                                }
                                                var commNode = [];
                                                checkedTree1Node.forEach(function (item, index) {
                                                    if (!item.isParent && item.checked) {
                                                        commNode.push(item);
                                                    }
                                                });
                                                if ($("#addHuaMianOption").val() === '2') {
                                                    checkedTree2Node.forEach(function (item, index) {
                                                        if (!item.isParent && item.checked) {
                                                            commNode.push(item);
                                                        }
                                                    })
                                                }
                                                // 如果没有勾选监控点位，则不必往下执行
                                                if (commNode.length == 0) {
                                                    // 给予提示
                                                    layer.msg('未选择监控点位');
                                                    // 关闭加载弹窗
                                                    layer.close(selectMonitorLoad);
                                                    return false;
                                                }
                                                if ((+$('#screenNumber').val() === 1 && commNode.length !== 1) || (+$('#screenNumber').val() === 4 && commNode.length > 4)) {
                                                    layer.msg('请添加和分屏数量一致的画面')
                                                    // 关闭加载弹窗
                                                    layer.close(selectMonitorLoad);
                                                    return false
                                                }
                                                // 将获得的监控添加进入已选列表
                                                if (vm.subSaveMonitorList.length == 0) {
                                                    vm.subSaveMonitorList = commNode;
                                                    // 加载已经选中的监控列表
                                                    addSelectMonitor(vm.subSaveMonitorList, 0);
                                                } else {
                                                    if ((+$('#screenNumber').val() === 1 && vm.subSaveMonitorList.length === 1) || (+$('#screenNumber').val() === 4 && vm.subSaveMonitorList.length === 4)) {
                                                        layer.msg('请添加和分屏数量一致的画面')
                                                        layer.close(selectMonitorLoad);
                                                        return false
                                                    }
                                                    var toAppendList = [];
                                                    var lastIndex = vm.subSaveMonitorList.length;
                                                    var hadSaveMonitorState = false; // 判断是否存在已保存的数据
                                                    commNode.forEach(function (item, index) {
                                                        var index = true;
                                                        vm.subSaveMonitorList.forEach(function (item1, index1) {
                                                            if (item.number == item1.number) {
                                                                index = false;
                                                                // 设置判断为真
                                                                hadSaveMonitorState = true;
                                                            }
                                                        })
                                                        if (index) {
                                                            vm.subSaveMonitorList.push(item);
                                                            toAppendList.push(item);
                                                        }
                                                    });
                                                    // 加载已经选中的监控列表
                                                    if (toAppendList.length != 0) {
                                                        addSelectMonitor(toAppendList, lastIndex)
                                                    };
                                                    if (hadSaveMonitorState) {
                                                        layer.msg('部分监控已添加至列表');
                                                        // 关闭加载弹窗
                                                        layer.close(selectMonitorLoad);
                                                    };
                                                }
                                            });
                                            // 删除按钮
                                            $('#delCheckMonitor').click(function () {
                                                console.log('删除已选中监控');
                                                // 添加加载动效
                                                selectMonitorLoad = layer.load();
                                                var list1 = vm.subSelectMonitorList;
                                                var list2 = vm.subSaveMonitorList;
                                                var newArray = list2.filter(function (item) {
                                                    if (!list1.includes(item)) return item;
                                                });
                                                vm.subSaveMonitorList = newArray;
                                                // 清空部分选项
                                                $('.right-monitor-list tbody').html('');
                                                vm.subSelectMonitorList = [];
                                                $('.right-monitor-list thead .button').removeClass('check-true-focus');
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                addSelectMonitor(vm.subSaveMonitorList, 0);
                                            });
                                            // 保存按钮
                                            $('#editMonitorSave').click(function () {
                                                if ((+$('#screenNumber').val() === 1 && vm.subSaveMonitorList.length !== 1) || ((+$('#screenNumber').val() === 4 && vm.subSaveMonitorList.length !== 4))) {
                                                    layer.msg('请添加和分屏数量一致的画面')
                                                    return false
                                                }
                                                // 清空已保存监控列表
                                                vm.mainSaveMonitorList = [];
                                                $('.haveList-table-list tbody').html('');
                                                if (vm.subSaveMonitorList.length != 0) {
                                                    vm.subSaveMonitorList.forEach(function (item, index) {
                                                        let str = haveListTableList(vm.subSaveMonitorList, index)
                                                        var html = '<tr><td><i data-number="' + item.number + '" class="button"></i></td><td>' + (index + 1) + '</td><td>' + item.number + '</td><td title="' + item.name + '">' + (item.name.length >= 10 ? item.name.slice(0, 10) + "..." : item.name) + '</td><td>' + str + '<a href=\'javascript:;\' data-number="' + item.number + '" class="delIcon_btn"></a></td></tr>';
                                                        $('.haveList-table-list tbody').append(html);
                                                        vm.mainSaveMonitorList.push(item);
                                                    });
                                                    // 重置按钮方法
                                                    restTableListDataEvent();
                                                    // 隐藏无数据
                                                    $('.nonListData').hide();
                                                    $('.haveListData').show();
                                                } else {
                                                    // 显示无数据
                                                    $('.nonListData').show();
                                                    $('.haveListData').hide();
                                                }
                                                // 更新创建弹窗中对的监控总数
                                                $('.haveSearch_SelectCount').text(JSON.stringify(vm.mainSaveMonitorList.length).length > 3 ? JSON.stringify(vm.mainSaveMonitorList.length).slice(0, 2) + '...' : vm.mainSaveMonitorList.length);
                                                vm.subSaveMonitorList = [];
                                                vm.subSelectMonitorList = [];
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                layer.close(editIndex);
                                            });
                                            // 取消保存按钮
                                            $('#editMonitorClose').click(function () {
                                                vm.subSaveMonitorList = [];
                                                vm.subSelectMonitorList = [];
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                layer.close(editIndex);
                                            });
                                            // 关闭按钮
                                            $('.transfer-diolag .transferDiolag_title .plan-setting-icon').click(function () {
                                                vm.subSaveMonitorList = [];
                                                vm.subSelectMonitorList = [];
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                                layer.close(editIndex);
                                            });
                                            // 已选择监控列表全选按钮
                                            $('.right-monitor-list thead .button').click(function () {
                                                if ($(this).hasClass('check-true-focus')) {
                                                    $(this).removeClass('check-true-focus');
                                                    $('.right-monitor-list tbody .button').removeClass('check-true-focus');
                                                    vm.subSelectMonitorList = [];
                                                } else {
                                                    vm.subSelectMonitorList = [];
                                                    $(this).addClass('check-true-focus');
                                                    $('.right-monitor-list tbody .button').addClass('check-true-focus');
                                                    vm.subSaveMonitorList.forEach(function (item) {
                                                        vm.subSelectMonitorList.push(item);
                                                    });
                                                }
                                                // 更新选中的监控数
                                                $('.rightMonitorSelect').text(vm.subSelectMonitorList.length);
                                            });
                                        }
                                        // 初始化弹窗方法
                                        _initEvent();
                                    }
                                });
                            });
                            // 保存预案
                            $('#editSavePlan').click(function () {
                                // 区分是原始保存还是新的保存
                                if ($("#playModeAddClassfyDefault").val() !== 3 && $("#playModeAddClassfyDefault").val() !== '3') {
                                    vm.savePlan(objData);
                                    console.log('原始保存')
                                } else {
                                    // 无锡 保存
                                    vm.savaNewPlan(objData)
                                    console.log('无锡保存')
                                };
                            });
                            // 关闭
                            $('.planDiolag .planDiolag_title .plan-setting-icon').click(function () {
                                vm.mainSaveMonitorList = [];
                                layer.close(initPlanDiolag);
                                initPlanDiolag = null
                                // layer.closeAll()
                            });
                            // 删除选中的监控
                            $('#edit_delMonitor').click(function () {
                                if ($('#edit_delMonitor').parent().hasClass('disabled')) {
                                    layer.msg('未存在选中监控');
                                    return;
                                }
                                var delAlert = layer.alert('您确定要删除？', {
                                    title: "提示",
                                    btn: ['确认', '取消'],
                                    yes: function () {
                                        layer.close(delAlert);
                                        var newArray = vm.mainSaveMonitorList.filter(function (item) {
                                            if (!vm.mainSelectMonitorList.includes(item)) return item;
                                        });
                                        vm.mainSaveMonitorList = newArray;
                                        vm.mainSelectMonitorList = [];
                                        // 重置部分参数
                                        restDataForTable(vm.mainSaveMonitorList);
                                        // 确定是否有选中，展示或置灰删除选中按钮
                                        hadCheckBox();
                                    }
                                })
                            });
                            // 清空选中的监控
                            $('#edit_clearMonitor').click(function () {
                                console.log('清空选中的监控');
                                var delAlert = layer.alert('您确定要清空？', {
                                    title: "提示",
                                    btn: ['确认', '取消'],
                                    yes: function () {
                                        layer.close(delAlert);
                                        // 清空已保存监控列表
                                        vm.mainSaveMonitorList = [];
                                        vm.mainSelectMonitorList = [];
                                        // 重置部分参数
                                        restDataForTable(vm.mainSaveMonitorList);
                                        // 确定是否有选中，展示或置灰删除选中按钮
                                        hadCheckBox();
                                    }
                                })
                            });
                            // 取消
                            $('#editClose').click(function () {
                                vm.mainSaveMonitorList = [];
                                layer.close(initPlanDiolag);
                                // layer.closeAll()
                                initPlanDiolag = null
                            });
                            // 已选择监控列表全选按钮
                            $('.haveList-table-list thead .button').click(function () {
                                if ($(this).hasClass('check-true-focus')) {
                                    $(this).removeClass('check-true-focus');
                                    $('.haveList-table-list tbody .button').removeClass('check-true-focus');
                                    vm.mainSelectMonitorList = [];
                                } else {
                                    vm.mainSelectMonitorList = [];
                                    $(this).addClass('check-true-focus');
                                    $('.haveList-table-list tbody .button').addClass('check-true-focus');
                                    vm.mainSaveMonitorList.forEach(function (item) {
                                        vm.mainSelectMonitorList.push(item);
                                    });
                                }
                                // 更新选中的监控数
                                $('.haveSearch_Select').text(JSON.stringify(vm.mainSelectMonitorList.length).length > 3 ? JSON.stringify(vm.mainSelectMonitorList.length).slice(0, 2) + '...' : vm.mainSelectMonitorList.length);
                                // 确定是否有选中，展示或置灰删除选中按钮
                                hadCheckBox();
                            });
                            // 分类设置按钮
                            $('#classificationSettings').click(function () {
                                console.log('分类设置')
                                _that.setClassify()
                            })
                            // 播放方式,无锡新增
                            $('#playModeAddClassfyDefault').change(function (val) {
                                console.log('切换无锡')
                                // 如果是编辑回显的数据，在切换的时候需要将列表数据清空
                                $('.haveList-table-list tbody').html('');
                                vm.mainSaveMonitorList = []
                                if ($(this).val() !== '3') {
                                    $('#switchLabelText').text('暂无监控设备')
                                    $('.nodefault').show()
                                    $('.defaultYx').hide()
                                    $('#planDiolag_planType').val($(this).val())
                                    // 处理默认加载的问题
                                    let planType = $('#planDiolag_planType').val();
                                    _queryTerminalList(planType);
                                }
                            })
                        }
                        function _initDiolag () {
                            console.log('初始化');
                            // 如果存在数据，则是编辑操作，需要回显数据
                            if (objData) {
                                if (objData.plan[0].secondPlanType && objData.plan[0].secondPlanType.name) {
                                    $.ajax({
                                        url: `planType/list/second.do?id=${objData.plan[0] && objData.plan[0].firstPlanType && objData.plan[0].firstPlanType.id}`,
                                        success: function (res) {
                                            console.log(res, '根据一级的id获取到的二级的数据')
                                            let { data, result } = res
                                            let str = `<option>请选择二级分类</option>`
                                            if (result) {
                                                data && data.length > 0 && data.forEach(c => {
                                                    str += `<option title="${c.name}" value="${c.id}">${c.name && c.name.length > 13 ? c.name.slice(0, 13) + '...' : c.name}</option>`
                                                })
                                            } else {
                                                str = `<option>暂无数据</option>`
                                            }
                                            $('#erjifenleiOptions').html(str)
                                            $('#erjifenleiOptions').show()
                                            $('#erjifenleiOptions').val(objData.plan[0].secondPlanType.id)
                                        }
                                    })
                                }
                                let planTypes = objData && objData.plan && objData.plan[0].planType || ''
                                if (planTypes === 3) {
                                    $('.defaultYx').show()
                                    $('.nodefault').hide()
                                } else {
                                    $('.defaultYx').hide()
                                    $('.nodefault').show()
                                }
                                $('.planDiolag_title .sptit').text('编辑预案');
                                // 渲染基础数据
                                var planData = objData.plan[0];
                                $('#PlanNameWX').val(planData.planName) // 无锡预案名称
                                $('#playModeAddClassfyDefault').val(planData.planType).toString() //无锡播放方式
                                $('#screenNumber').val(planData.screens).toString() // 无锡分屏数量
                                setTimeout(_ => {
                                    $('#classfulist').prepend(`<span title="${planData.firstPlanType && planData.firstPlanType.name}" idName='${planData.firstPlanType && planData.firstPlanType.id}'>${planData.firstPlanType && planData.firstPlanType.name.length > 14 ? planData.firstPlanType && planData.firstPlanType.name.slice(0, 14) + '...' : planData.firstPlanType && planData.firstPlanType.name}</span>`)
                                }, 1000) // 无锡 预案分类
                                $('#addHuaMianOption').val(planData.deviceMenuType).toString() // 无锡播放类型
                                $("#switchLabelText").text(planData.deviceMenuType === 1 ? '暂无终端设备' : '暂无监控设备')
                                $('#planDiolag_planName').val(planData.planName);
                                $('#planDiolag_flag64').val(planData.flag64);
                                $('#planDiolag_planType').val(planData.planType);
                                $('#planDiolag_intervalTime').val(parseInt(planData.intervalTime) > 45 ? 'ZDY' : planData.intervalTime);
                                $('#planDiolag_intervalTime_input').val(planData.intervalTime);
                                if ($('#planDiolag_intervalTime').val() == 'ZDY') { $('#planDiolag_intervalTime_input').prop('disabled', false); }
                                if (planData.openTiming == 1) {
                                    $('#planDiolag_openTiming').addClass('check-true-focus');
                                    $('.planDiolag_openTiming').val('1');
                                    // 开放日期选择框
                                    $('#planDiolag_startTime').prop('disabled', false);
                                    $('#planDiolag_endTime').prop('disabled', false);
                                }
                                $('#planDiolag_startTime').val(planData.startTime);
                                $('#planDiolag_endTime').val(planData.endTime);
                                // 渲染监控数据
                                vm.mainSaveMonitorList = objData.monitorList;
                                // 重置部分参数
                                restDataForTable(vm.mainSaveMonitorList);
                            }
                            // 预案类型默认电视墙
                            var planType = $('#planDiolag_planType').val();
                            console.log(planType);
                            // 获取预案类型常用设备
                            _queryTerminalList(planType, objData);
                            // 初始化点击事件
                            _initDiolagEvent();
                        }
                        // 初始化页面
                        _initDiolag();
                    }
                });
            },
            /* 预案参数校验 */
            checkPlanData: function () {
                console.log(vm.mainSaveMonitorList);
                // 监控列表接口对象
                var devicesObj = {
                    plans: [{
                        planId: ''
                    }],
                    devices: []
                }
                vm.mainSaveMonitorList.forEach(function (item, index) {
                    var arrayList = {
                        deviceID: item.deviceID ? item.deviceID : item.id, // ztreeDemo1和ztreeDemo2的回参不一致
                        sort: index
                    }
                    devicesObj.devices.push(arrayList);
                });
                console.log(devicesObj);
                // 创建预案接口对象
                var params = {
                    planId: '',
                    planName: $('#planDiolag_planName').val(),
                    startTime: $('.planDiolag_openTiming').val() == '1' ? $('#planDiolag_startTime').val() : '',
                    openTiming: $('.planDiolag_openTiming').val(),
                    endTime: $('.planDiolag_openTiming').val() == '1' ? $('#planDiolag_endTime').val() : '',
                    screens: $('#planDiolag_screens').val(),
                    remark: '',
                    planType: parseInt($('#planDiolag_planType').val()),
                    deviceId: '',
                    tvWallId: '',
                    flag64: parseInt($('#planDiolag_flag64').val()),
                    intervalTime: parseInt($('#planDiolag_intervalTime_input').val()),
                    devicesObj: devicesObj,
                    deviceMenuType: 2
                };
                console.log(params);
                // 校验不能为空的参数
                if (!params.planName) {
                    layer.msg('预案名称不能为空');
                    return false;
                }
                // 判断是否是特殊符号
                var reg = /[\s+`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g;
                if (reg.test(params.planName)) {
                    layer.msg('预案名称仅支持输入中英文和数字，不支持输入符号');
                    return false;
                }
                if ($('.planDiolag_openTiming').val() == '1') {
                    if (!params.startTime) {
                        layer.msg('未设置预案开始执行时间');
                        return false;
                    }
                    if (!params.endTime) {
                        layer.msg('未设置预案结束执行时间');
                        return false;
                    }
                }
                if (!$('#planDiolag_intervalTime_input').val()) {
                    layer.msg('轮询时间间隔应为15-300秒');
                    return false;
                }
                if (parseInt($('#planDiolag_intervalTime_input').val()) < 15 || parseInt($('#planDiolag_intervalTime_input').val()) > 300) {
                    layer.msg('轮询时间间隔应为15-300秒');
                    return false;
                }
                if (params.devicesObj.devices.length <= 0) {
                    layer.msg('需设置预案监控');
                    return false;
                }
                if (params.devicesObj.devices.length <= parseInt($('#planDiolag_screens').val())) {
                    layer.msg('需轮询的预案监控数应大于轮询画面');
                    return false;
                }
                // 校验参数是否匹配
                if (params.planType == '1') { // 如果预案类型为终端多画面
                    console.log('预案类型为终端多画面');
                    if (!$('#planDiolag_deviceId').val()) {
                        layer.msg('未设置常用终端');
                        return false;
                    }
                    var deviceSreens = 4; // 设置默认4屏
                    var deviceType = parseInt($("#planDiolag_deviceId").find("option:selected").attr('data-type'));
                    // 根据Type判断设备最大支持的分屏数
                    if (deviceType == 6 || deviceType == 1007 || deviceType == 1030) {
                        deviceSreens = 1;
                    } else if (deviceType == 1045 || deviceType == 1010) {
                        deviceSreens = 16;
                    }
                    if (parseInt($('#planDiolag_screens').val()) > parseInt(deviceSreens)) {
                        layer.msg('选择的轮询画面与设备不符');
                        return false;
                    }
                    params.deviceId = parseInt($('#planDiolag_deviceId').val());
                }
                if (params.planType == '2') { // 如果预案类型为八路电视墙
                    console.log('预案类型为八路电视墙');
                    if (!$('#planDiolag_deviceId').val()) {
                        layer.msg('未设置八路电视墙');
                        return false;
                    }
                    var deviceSreens = $("#planDiolag_deviceId").find("option:selected").attr('data-sreens');
                    if (parseInt(deviceSreens) != parseInt($('#planDiolag_screens').val())) {
                        layer.msg('选择的轮询画面与设备不符');
                        return false;
                    }
                    params.tvWallId = parseInt($('#planDiolag_deviceId').val());
                }
                return params;
            },
            /*关联保存的预案监控*/
            savePlanDevices: function (params) {
                console.log('关联保存的预案监控');
                var isParams = params.devicesObj;
                console.log(isParams);
                $.ajax({
                    url: 'planPolling/createPlanPollingDevice.do',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(isParams),
                    contentType: "application/json;charset=UTF-8",
                    success: function (res) {
                        console.log(res)
                        layer.msg(res.msg);
                        vm.mainSaveMonitorList = [];
                        $('.haveList-table-list tbody').html('');
                        layer.close(clearLayer);
                        layer.close(initPlanDiolag);
                        vm.getList();
                    },
                    fail: function (fail) {
                        console.log(fail)
                        layer.close(clearLayer);
                        layer.msg(fail.msg);
                    }
                })
            },
            /*保存预案*/
            savePlan: function (objData) {
                // 校验参数是否正确
                var isParams = vm.checkPlanData();
                if (!isParams) { return; }
                var ajaxUrl = 'planPolling/createPlanPolling.do'; // 默认新建路径
                // 如果存在数据，则是编辑操作
                if (objData) {
                    ajaxUrl = 'planPolling/updatePlanPolling.do'; // 修改为编辑路径
                    isParams.planId = objData.plan[0].planId;
                }
                clearLayer = layer.load();
                $.ajax({
                    url: ajaxUrl,
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(isParams),
                    contentType: "application/json;charset=UTF-8",
                    success: function (res) {
                        console.log(res);
                        if (res.result) {
                            if (!objData) {
                                isParams.devicesObj.plans[0].planId = res.data;
                            } else {
                                isParams.devicesObj.plans[0].planId = isParams.planId;
                            }
                            vm.savePlanDevices(isParams);
                        } else {
                            layer.close(clearLayer);
                            layer.msg(res.msg);
                        }
                    },
                    fail: function (fail) {
                        console.log(fail)
                        layer.close(clearLayer);
                        layer.msg(fail.msg);
                    }
                })
            },
            // 无锡 保存预案
            savaNewPlan: function (objData) {
                console.log(objData)
                if ($('#PlanNameWX').val() === '' || $('#PlanNameWX').val() === undefined) {
                    layer.msg('预案名称不能为空')
                    return false
                }
                // +$('#screenNumber').val() 获取的当前的分屏数量
                // vm.mainSaveMonitorList 获取的当前的编辑回显数据的列表中的数据
                if (+$('#screenNumber').val() !== vm.mainSaveMonitorList.length) {
                    layer.msg('请添加和分屏数量一致的画面')
                    return false
                }
                // 监控列表接口对象
                var devicesObj = {
                    plans: [{
                        planId: ''
                    }],
                    devices: []
                }
                vm.mainSaveMonitorList.forEach(function (item, index) {
                    var arrayList = {
                        deviceID: item.deviceID ? item.deviceID : item.id, // ztreeDemo1和ztreeDemo2的回参不一致
                        sort: index
                    }
                    devicesObj.devices.push(arrayList);
                });
                if (devicesObj.devices.length <= 0) {
                    layer.msg('需设置预案终端或监控')
                    return false
                }
                console.log(devicesObj)
                let params = {
                    planName: $('#PlanNameWX').val(), // 预案名称
                    planType: +$('#playModeAddClassfyDefault').val(), // 预案类型1:终端轮询 2：电视墙轮询 3.本地播放
                    screens: +$('#screenNumber').val(),  // 分屏数量
                    planCategory: +$('#erjifenleiOptions').val() !== 0 ? +$('#erjifenleiOptions').val() : +$('#classfulist').find('span').attr('idName') || 0, //	预案分类ID
                    deviceMenuType: +$('#addHuaMianOption').val(), //播放类型:1.终端 2.监控
                    openTiming: 0, // 定时执行默认参数
                    planId: null
                }
                clearLayerWX = layer.load();
                console.log(params)
                var val = $('.planDiolag_title .sptit').text()
                let url = 'planPolling/createPlanPolling.do'
                val === '编辑预案' ?
                    (url = 'planPolling/updatePlanPolling.do', params['planId'] = objData.plan[0].id) :
                    (url, params['planId'] = null, devicesObj.plans[0].planId = '')
                $.ajax({
                    url,
                    type: 'post',
                    dataType: 'json',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(params),
                    success: function (res) {
                        console.log(res)
                        let { result, data } = res
                        if (result) {
                            val === '编辑预案' ? devicesObj.plans[0].planId = objData.plan[0].id : devicesObj.plans[0].planId = data
                            $.ajax({
                                url: 'planPolling/createPlanPollingDevice.do',
                                type: 'post',
                                dataType: 'json',
                                contentType: "application/json;charset=UTF-8",
                                data: JSON.stringify(devicesObj),
                                success: function (res) {
                                    console.log(res)
                                    if (res.result) {
                                        vm.mainSaveMonitorList = [];
                                        $('.haveList-table-list tbody').html('');
                                        layer.close(clearLayerWX);
                                        layer.close(initPlanDiolag);
                                        vm.getList();
                                    } else {
                                        layer.msg('保存失败')
                                    }
                                }
                            })
                        } else {
                            layer.msg('保存失败')
                        }
                    }
                })
            },
            // 预案分类下拉框的事件
            planClassificationChange () {
                console.log(this.planClassificationVal)
                let that = this
                let id = this.allClassifyOptionList[this.planClassificationVal] && this.allClassifyOptionList[+this.planClassificationVal].id
                this.planClassificationVal !== 0 && this.planClassificationVal !== 1 ?
                    $.ajax({
                        url: `planType/list/second.do?id=${id}`,
                        success: function (res) {
                            if (res.result) {
                                that.allClassifyOptionListIsChildren = res.data && res.data.length > 0 && res.data.map(c => {
                                    c['iconFlag'] = false
                                    return c
                                })
                            } else {
                                that.allClassifyOptionListIsChildren = []
                            }
                        }
                    }) : ''
                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    planName: this.searchPlanName,
                    planType: [id],
                    planTypeLevel: 1
                }
                this.searchInpObj = {
                    planType: [id],
                    planTypeLevel: 1
                }
                // 全部分类
                if (this.planClassificationVal === 0) {
                    delete params['planType']
                    delete params['planTypeLevel']
                    delete this.searchInpObj['planType']
                    delete this.searchInpObj['planTypeLevel']
                }
                // 不分类
                if (this.planClassificationVal === 1) {
                    params['planType'] = [0]
                    params['planTypeLevel'] = 0
                    this.searchInpObj['planType'] = 0
                    this.searchInpObj['planTypeLevel'] = 0
                }
                console.log(params)
                this.getCheckedList(params)
                console.log(this.planClassificationVal)
            },
            // 无锡 获取列表数据interface
            getCheckedList (data) {
                $.ajax({
                    url: 'planPolling/pagePlanPolling.do',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (data) {
                        if (data.result && data.list && data.list.list && data.list.list.length > 0) {
                            layer.close(vm.layerLoading);
                            vm.allpageNum = data.list.pages;
                            vm.allDataNum = data.list.total;
                            // 判断请求的页数是否比得到的总页数大 如果大就按照这个条件将页码归1从新查询
                            if (vm.allpageNum > 0 && vm.pageNum > vm.allpageNum) {
                                // 按照这个条件从第一页再查询一次
                                vm.ificationClick(vm.indexNum);
                            }
                            vm.userTotal = data.list.total;
                            vm.deviceList = []; //清空数据
                            vm.deviceList = data.list.list;
                        } else {
                            layer.close(vm.layerLoading);
                            vm.allpageNum = 0;
                            vm.allDataNum = 0;
                            vm.userTotal = 0;
                            vm.deviceList = [];
                        }
                    }
                })
            },
            // 无锡 预案分类二级下拉勾选点击事件
            subsetMenuLiChecked (item) {
                console.log(item)
                let id = this.allClassifyOptionList[this.planClassificationVal] && this.allClassifyOptionList[+this.planClassificationVal].id
                console.log(id)
                item.iconFlag = !item.iconFlag
                let planType = this.allClassifyOptionListIsChildren.map(c => {
                    if (c.iconFlag) {
                        return c.id
                    } else {
                        return ''
                    }
                }).filter(k => {
                    return k !== ''
                })
                this.searchInpObj = {
                    planType: planType && planType.length > 0 ? planType : [id],
                    planTypeLevel: planType && planType.length > 0 ? 2 : 1
                }
                this.getCheckedList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    planName: this.searchPlanName,
                    planType: planType && planType.length > 0 ? planType : [id],
                    planTypeLevel: planType && planType.length > 0 ? 2 : 1
                })
            },
            // 无锡，分类设置事件
            setClassify (flag) {
                let that = this
                //allClassifyListArr
                $.ajax({
                    url: '/gisPlatform/planType/list.do',
                    type: 'get',
                    success: function (res) {
                        console.log(res)
                        let { result, data } = res
                        if (result) {
                            that.allClassifyListArr = data && data.length && data.length > 0 ? data.map((c, i) => {
                                c['index'] = i
                                c['isIcon'] = data && data.children && data.children.length > 0 ? true : false
                                c['isLabel'] = data && data.children && data.children.length > 0 ? true : false
                                c.children = c.children && c.children.length > 0 ? c.children.map((k, ind) => {
                                    k['index'] = ind
                                    return k
                                }) : []
                                return c
                            }) : []
                            console.log(that.allClassifyListArr)
                        } else {
                            that.allClassifyListArr = []
                        }
                    }
                })
                if (flag === false) return // 防止再次调用的时候，再次触发打开弹窗
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    content: $('.set-classify'),
                    area: ['6.04rem', '4.42rem'],
                    // moveOut:false, // 默认只能在窗口内拖拽，如果你想让拖到窗外，那么设定moveOut: true即可
                    // move 默认是触发标题区域拖拽。如果你想单独定义，指向元素的选择器或者DOM即可,你还配置设定move: false来禁止拖拽,此处的元素选择很重要
                    // 不然可能会出现可以拖拽，但是不能关闭的问题 ！！！！！！！！！！！
                    move: '.set-classify .labelTitle .move-span-yx',
                    success: function (index, o) {
                        //关闭
                        $('.set-classify .labelIcon').click(function () {
                            layer.close(o);
                            console.log(that)
                        });
                        //取消
                        $('.edit-close').click(function () {
                            layer.close(o);
                        });

                    }
                })
            },
            // 无锡 Icon 图标点击事件
            secondaryLabelFun (obj) {
                this.allClassifyListArr = this.allClassifyListArr.map(c => {
                    if (c.index === obj.index) {
                        c.isLabel = !c.isLabel
                        c.isIcon = !c.isIcon
                    }
                    return c
                })
            },
            // 无锡 添加分类按钮
            addClassfyFun () {
                console.log('添加分类')
                var that = this;
                var load = layer.load();
                let obj = {
                    action: '/planType/list/first.do',
                    type: 'get'
                }
                ajaxdata(obj, function (result, data) {
                    if (result) {
                        creatAddLayer(data.data);
                    } else {
                        layer.msg(data.msg);
                    }
                    layer.close(load);
                });
                function creatAddLayer (labelList) {
                    var content = '<div class="labelAdd newLabel">\
                               <div class="labelTitle">添加分类<a class="labelIcon" href="javascript:;"></a></div>\
                               <div class="labelBox"><span class="labelName">分类级别：</span><select id="addLevel"><option value="1">一级分类</option><option value="2">二级分类</option></select></div>\
                               <div class="labelBox fistLevNameDiv"><span class="labelName"></span><select id="fistLevName"><option value="0">请选择一级分类</option></select><p>该分类下已有预案，不可再添加分类</p></div>\
                               <div class="labelBox"><span class="labelName">分类名称：</span><input autocomplete="off" placeholder="最多20字" id="labelName" type="text" class="labelText" maxlength="20"></div>\
                               <div class="btn">\
                                   <a href="javascript:;" class="edit-confirm" id="edit">保存</a>\
                                   <a href="javascript:;" class="edit-close">取消</a>\
                               </div>\
                           </div>';
                    var str = '';
                    layer.open({
                        content: content,
                        title: false,
                        closeBtn: 0,
                        type: 1,
                        success: function (layero, index) {
                            labelList.forEach(function (item) {
                                str += '<option  title="' + item.name + '"  value="' + item.id + '" >' + item.name + '</option>';
                            });
                            var devicesLength = 0;
                            $('#fistLevName').append(str);
                            // $('#fistLevName').change(function () {
                            //     // devicesLength = $(this).find("option:selected").attr('data-deviceslength');
                            //     var obj = {
                            //         action: 'labelManage/getLabelTreeByPid.do?labelId='+$(this).find("option:selected").val(),
                            //         type: 'get',
                            //     };
                            //     var load = layer.load();
                            //     ajaxdata(obj, function (result, data) {
                            //         if (result) {
                            //             // creatAddLayer(data.data);
                            //             devicesLength =  data.deviceList.length;
                            //             if (Number(devicesLength)) {
                            //                 $('.fistLevNameDiv p').css('visibility', 'inherit');
                            //             } else {
                            //                 $('.fistLevNameDiv p').css('visibility', 'hidden');
                            //             }
                            //         } else {
                            //             layer.msg(data.msg);
                            //         }
                            //         layer.close(load);
                            //     });
                            // });
                            /*保存*/
                            $('#edit').click(function () {
                                if ($.trim($('.labelText').val()) == '') {
                                    layer.msg('请填写标签名称');
                                    return;
                                }
                                var re = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/gi;
                                var res = re.test($('.labelText').val());
                                if (!res) {
                                    layer.msg('标签名称只能输入中文、英文、数字、下划线');
                                    return;
                                }
                                if ($('#addLevel').val() == 2 && $('#fistLevName').val() == 0) {
                                    layer.msg('请选择上级标签');
                                    return;
                                }
                                if ($('#addLevel').val() == 2 && Number(devicesLength)) {
                                    layer.msg('该标签下已有设备，不可再添加标签');
                                    return;
                                }
                                var load = layer.load();
                                var json = {
                                    name: $.trim($('.labelText').val()),
                                };
                                if ($('#addLevel').val() == 2) {
                                    json['pid'] = $('#fistLevName').val()
                                } else {
                                    delete json['pid']
                                }
                                $.ajax({
                                    url: 'planType/create.do',
                                    type: 'POST',
                                    dataType: 'json',
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify(json),
                                    success: function (data) {
                                        console.log(data)
                                        if (data.result) {
                                            // 获取列表
                                            that.setClassify(false)
                                            // 从新获取一级分类
                                            that.getClassfyToFrom()
                                            // 获取头部下拉框的预案分类
                                            that.againGetallClassifyOptionList()
                                            // 重新获取二级分类
                                            that.planClassificationChange()
                                            // 对二级分类显示进行隐藏
                                            $('#erjifenleiOptions').hide()
                                            // zjj yuexin
                                            layer.close(index)
                                        } else {
                                            layer.msg(data.msg);
                                        }
                                        layer.close(load);
                                    },
                                    error: function (data) {
                                        layer.msg(data);
                                        console.log(data);
                                    }
                                })
                            });
                            $('.edit-close').click(function () {
                                layer.close(index);
                            });
                            $('.labelIcon').click(function () {
                                layer.close(index);
                            });
                            $('#addLevel').change(function () {
                                if ($(this).val() == 1) {
                                    $('.fistLevNameDiv').css('display', 'none');
                                } else {
                                    $('.fistLevNameDiv').css('display', 'block');
                                }
                            })
                        }
                    })
                }
            },
            //无锡 编辑icon事件
            editListItem (key, obj) {
                console.log(key, obj)
                let that = this
                obj['y_key'] = key
                that.editClassfyItem = obj;
                that.editDialogClassfy = layer.open({
                    type: 1,
                    title: false,
                    resize: false,
                    closeBtn: 0,
                    content: $('#editClassfy'),
                    success: function (index, o) {
                        that.classfyName = obj.name
                        //关闭
                        $('#editClassfy .labelIcon').click(function () {
                            layer.close(o);
                        });
                        //取消
                        $('#editClassfy .edit-close-y').click(function () {
                            layer.close(o);
                        });

                    }
                })
            },
            // 编辑标签 弹窗保存按钮
            saveClassfyBthFun () {
                let that = this
                console.log(this.editClassfyItem)
                console.log(this.classfyName)
                let params;
                params = {
                    name: that.classfyName
                }
                if (that.editClassfyItem.y_key === 'children') {
                    params['pid'] = that.editClassfyItem.pid
                } else {
                    delete params['pid']
                }
                $.ajax({
                    url: `planType/update/${that.editClassfyItem.id}.do`,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(params),
                    success: function (data) {
                        if (data.result) {
                            that.setClassify(false)
                            // 获取头部下拉框的预案分类
                            that.againGetallClassifyOptionList()
                            layer.close(that.editDialogClassfy)
                        } else {
                            layer.msg(data.msg);
                        }
                    },
                    error: function (data) {
                        layer.msg(data);
                    }
                })
            },
            // 无锡 删除icon事件
            deldteListItem (key, obj, ind) {
                let that = this
                console.log('删除', key, obj, ind)
                let layerRemove = layer.open({
                    title: "确认删除",
                    content: `该分类下存在部分数据，确认删除？<br/><span style="color: #bdb7b7">分类下的所有数据将一并删除</span>`,
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        $.ajax({
                            url: `planType/delete/${obj.id}.do`,
                            type: 'POST',
                            dataType: 'json',
                            contentType: "application/json;charset=UTF-8",
                            // data:JSON.stringify(params),
                            success: function (data) {
                                if (data.result) {
                                    // 重新获取列表
                                    that.setClassify(false)
                                    // 重新获取一级分类
                                    that.getClassfyToFrom()
                                    // 获取头部下拉框的预案分类
                                    that.againGetallClassifyOptionList()
                                    // 重新获取二级分类
                                    that.planClassificationChange()
                                    // 对二级分类显示进行隐藏
                                    $('#erjifenleiOptions').hide()
                                    layer.close(layerRemove)
                                } else {
                                    layer.msg(data.msg);
                                }
                            },
                            error: function (data) {
                                layer.msg(data);
                            }
                        })
                    },
                    btn2: function (layerid) {
                        layer.close(layerid);
                    }
                });
            },
            /*添加预案*/
            addPlan: function () {
                console.log('添加预案');
                vm.initPlanDiolag();
            },
            /*编辑预案*/
            editPlan: function (obj) {
                console.log('编辑预案');
                console.log(obj);
                var editPlanLayer = layer.load();
                var params = {
                    action: 'planPolling/selectPlanPollingDevice.do',
                    type: 'get',
                    planId: obj.planId,
                    pageNum: -1
                };
                ajaxdata(params, function (result, data) {
                    if (result) {
                        console.log(data);
                        layer.close(editPlanLayer);
                        vm.initPlanDiolag(data.data);
                    } else {
                        layer.msg(data.msg);
                        layer.close(editPlanLayer);
                    }
                });
            },
            /*删除预案*/
            deletePlan: function (data) {
                console.log('删除预案');
                if (data == "") {
                    layer.msg("请选择数据");
                    return
                }
                var lindex = layer.confirm('该操作将清除已选择预案，是否继续？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    var params = [];
                    data.split(',').forEach(function (item, index) {
                        if (!item) return;
                        var arrayList = {
                            planId: item,
                            state: 0,
                            openTiming: 0
                        }
                        params.push(arrayList);
                    });
                    var deletePlanLayer = layer.load();
                    $.ajax({
                        url: 'planPolling/updatePlanPollingStatus.do',
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify(params),
                        contentType: "application/json;charset=UTF-8",
                        success: function (res) {
                            console.log(res)
                            // layer.msg(res.msg);
                            layer.msg('删除预案成功');
                            layer.close(deletePlanLayer);
                            vm.getList();
                        },
                        fail: function (fail) {
                            console.log(fail)
                            layer.close(deletePlanLayer);
                            // layer.msg(fail.msg);
                            layer.msg('删除预案失败');
                        }
                    })
                    layer.close(lindex);
                }, function () {
                    layer.close(lindex);
                });

            },
            /**全选**/
            fnClickAll: function () {
                this.checkedAll = !this.checkedAll;
                var _this = this;
                if (this.checkedAll) { //true全选
                    // console.log(this.checkedAllLength)
                    // 先清空id
                    _this.deleteArray = "";
                    // 遍历数据列表 给数据加一个临时字段用来控制选中状态
                    this.deviceList.forEach(function (item, index) {
                        let deviceID = item.type == 102 ? (item.deviceID ? item.deviceID : item.id) : item.id;
                        // 如果没有这个字段 就加上
                        if (typeof item.checked == 'undefined') {
                            _this.$set(item, 'checked', _this.checkedAll);

                            // 再将所有要删除的id加进去
                            // if(_this.indexNum==7){
                            if (_this.indexNum == 8) {
                                _this.deleteArray += item.labelId + ",";
                            } else if (_this.indexNum == 6) {
                                _this.deleteArray += item.deviceID + ",";
                            } else {
                                _this.deleteArray += item.id + ",";
                                if (_this.exceptionArray.includes(deviceID)) {
                                    _this.exceptionArray.splice(_this.exceptionArray.indexOf(deviceID), 1);
                                }
                            }
                        } else {
                            item.checked = true;
                            // 将全选的id拼接并保存
                            // if(_this.indexNum==7){
                            if (_this.indexNum == 8) {
                                _this.deleteArray += item.labelId + ",";
                            } else if (_this.indexNum == 6) {
                                _this.deleteArray += item.deviceID + ",";
                            } else {
                                _this.deleteArray += item.id + ",";
                                if (_this.exceptionArray.includes(deviceID)) {
                                    _this.exceptionArray.splice(_this.exceptionArray.indexOf(deviceID), 1);
                                }
                            }

                        }
                    });
                    this.checkedAllLength = this.deviceList.length;
                    // console.log("=============="+_this.deleteArray);
                } else { //true全选

                    this.deviceList.forEach(function (item, index) {
                        let deviceID = item.type == 102 ? (item.deviceID ? item.deviceID : item.id) : item.id;
                        if (typeof item.checked == 'undefined') {
                            _this.$set(item, 'checked', _this.checkedAll);
                            _this.exceptionArray.push(deviceID);
                        } else {
                            item.checked = false;
                            _this.deleteArray = "";
                            _this.exceptionArray.push(deviceID);
                        }
                    });
                    this.checkedAllLength = 0;
                    // console.log("=============="+_this.deleteArray);
                }
            },
            /**单个勾选**/
            fnClick: function (o) {
                let deviceID = o.type == 102 ? (o.deviceID ? o.deviceID : o.id) : o.id;
                // 如果字段不存在
                if (typeof o.checked == 'undefined') {
                    this.$set(o, 'checked', true);
                    // if(this.indexNum==7){
                    if (this.indexNum == 8) {
                        this.deleteArray += o.labelId + ",";
                    } else if (this.indexNum == 6) {
                        this.deleteArray += o.deviceID + ",";
                    } else {
                        this.deleteArray += o.id + ",";
                    }
                    this.checkedAllLength++; //单选后勾选数量加1
                    // console.log(this.checkedAllLength)
                } else {
                    o.checked = !o.checked;
                    if (o.checked == true) {
                        // if(this.indexNum==7){
                        if (this.indexNum == 8) {
                            this.deleteArray += o.labelId + ",";
                        } else if (this.indexNum == 6) {
                            this.deleteArray += o.deviceID + ",";
                        } else {
                            this.deleteArray += o.id + ",";
                        }
                        this.checkedAllLength++; //单选后勾选数量加1
                        // console.log(this.checkedAllLength)
                        if (deviceID && this.exceptionArray.includes(deviceID)) {
                            this.exceptionArray.splice(this.exceptionArray.indexOf(deviceID), 1);
                        }
                    } else {
                        //将自己的id从字符串中删掉
                        // if(this.indexNum==7){
                        if (this.indexNum == 8) {
                            this.deleteArray = this.deleteArray.replace(o.labelId + ",", "");
                        } else {
                            this.deleteArray = this.deleteArray.replace(o.id + ",", "");
                            this.exceptionArray.push(deviceID);
                        }
                        this.checkedAllLength--; //取消后勾选数量减1
                        // console.log(this.checkedAllLength)
                    }
                }
                if (this.checkedAllLength == this.deviceList.length) { //如果勾选数量等于当前页数据量
                    this.checkedAll = true; //全选按钮打开
                } else {
                    this.checkedAll = false;
                }
            },
            /**单个勾选**/
            fnClickTwo: function (o) {
                // 如果字段不存在
                if (typeof o.checked == 'undefined') {
                    this.$set(o, 'checked', true);
                    // if(this.indexNum==7){
                    if (this.indexNum == 8) {
                        this.deleteArray += o.labelId + ",";
                    } else {
                        this.deleteArray += o.id + ",";
                    }
                    this.checkedAllLength++; //单选后勾选数量加1
                    // console.log(this.checkedAllLength)
                } else {
                    o.checked = !o.checked;
                    if (o.checked == true) {
                        // if(this.indexNum==7){
                        if (this.indexNum == 8) {
                            this.deleteArray += o.labelId + ",";
                        } else {
                            this.deleteArray += o.id + ",";
                        }
                        this.checkedAllLength++; //单选后勾选数量加1
                        // console.log(this.checkedAllLength)
                    } else {
                        //将自己的id从字符串中删掉
                        // if(this.indexNum==7){
                        if (this.indexNum == 8) {
                            this.deleteArray = this.deleteArray.replace(o.labelId + ",", "");
                        } else {
                            this.deleteArray = this.deleteArray.replace(o.id + ",", "");
                        }
                        this.checkedAllLength--; //取消后勾选数量减1
                        // console.log(this.checkedAllLength)
                    }
                }
                if (this.checkedAllLength == this.deviceList.length) { //如果勾选数量等于当前页数据量
                    this.checkedAll = true; //全选按钮打开
                } else {
                    this.checkedAll = false;
                }
            },
            /**批量操作时间计算**/
            // batchOperTime: function() {
            //     if(Number(vm.allDataNum)){
            //         let seconds = Math.ceil(vm.allDataNum / 2000); //秒数 每秒2000条
            //         let seconds1 = 0; //秒数 以5为单位向上取整
            //         let minutes = 0;
            //         let hours = 0;
            //         if (seconds >= 3600) {
            //             hours = parseInt(seconds / 3600);
            //             minutes = parseInt(seconds % 60);
            //             return `${hours}小时${minutes > 0 ? `${minutes}分钟` : ``}`;
            //         } else if (seconds >= 60) {
            //             minutes = parseInt(seconds / 60);
            //             secondsR = parseInt(seconds % 60);
            //             seconds1 = secondsR % 5 === 0 ? secondsR : parseInt((secondsR / 5) + 1) *5;
            //             return `${minutes}分${seconds1 > 0 ? `${seconds1}秒` : ``}`;
            //         } else if (seconds >= 5){
            //             seconds1 = seconds % 5 === 0 ? seconds : parseInt((seconds / 5) + 1) *5;
            //             return `${seconds1}秒`;
            //         }
            //     }
            // },
            /**批量收藏 请求**/
            batchCollectionRequest: function (li, state, callback) {
                var _this = this;
                var loadDev = layer.load();
                ajaxdata2(li, "device/settingBatchCollect.do", 'POST', function (result, data) {
                    // console.log(result,data);
                    var str = state == 3 ? "" : "un";
                    layer.close(loadDev);
                    if (result) {
                        typeof callback == "function" && callback();
                    } else {
                        layer.msg(data.msg);
                    }
                });
            },
            /**按条件搜索全部收藏 请求**/
            batchCollectionRequest1: function (callback) {
                var _this = this;
                var params = {
                    platformID: vm.platformID,
                    removeIds: vm.exceptionArray.filter(i => i && i.trim()).join(","), //排除在外的设备ID
                    Ids: '', // 设备主键ID,拼接的id串
                    deleteType: 1, // 1:全部（按照条件删除） 其他：通过ids删除
                    menuType: vm.terminalType, // 设备分类大类型大菜单类型
                    number: vm.terminalNum, // 设备号码
                    deviceName: vm.terminalName, // 设备名称
                    equipmentId: vm.regionId, // 当前选择的行政区域ID
                    source: vm.source, // 设备来源标识 默认0
                    gradeid: vm.city_gradeid, // 当前行政区域层级
                    lngAndLatType: vm.lngAndLatType, // 	经纬度状态 默认0 ：全部 1：正常 2：异常
                    userId: vm.userInfoId, // 当前登录用户ID
                    isCheckLngAndLat: true, // 是否过滤经纬度不正常的终端 默认true
                    type: vm.searchTerType == 0 ? "" : vm.searchTerType, // 设备分类小类型
                    action: 'device/settingBatchCollectByParam.do',
                };
                // console.log("全部收藏",params);
                var loadDev = layer.load();
                ajaxdata(params, function (result, data) {
                    layer.close(loadDev);
                    if (result) {
                        layer.msg("收藏成功");
                        typeof callback == "function" && callback();
                        vm.getList();
                    } else {
                        layer.msg(data.msg);
                    }
                });
            },
            /**批量收藏**/
            batchCollection: function () {
                let list = [];
                if (this.batchOperOption == '0') { //选中数据
                    list = this.deviceList.filter(i => i.checked);
                    if (!list.length) {
                        layer.msg("请选中至少一个终端");
                        return;
                    };
                } else if (this.batchOperOption == '1') { //当前页数据
                    // list = this.deviceList
                    list = this.deviceList.filter(i => i.checked);
                    if (!list.length) {
                        layer.msg("请选中至少一个终端");
                        return;
                    };
                } else if (this.batchOperOption == '2') { //按条件搜索全部收藏
                    if ((this.allDataNum - this.exceptionArray.length) < 10000) {
                        this.batchCollectionRequest1();
                    } else {
                        layer.msg("单个类型收藏上限为1万，当前选中数据已超出上限，请减少数据再收藏");
                    }
                    return;
                    // // 全部收藏确认弹窗
                    // var _html =
                    // `<div id='batchOperConfirm' class='editLabel1 relatednessLayer1'>
                    //     <div class='labelTitle'>批量收藏<a class='labelIcon' href='javascript:;'></a></div>
                    //     <div class='relatedContent assocLabel'>
                    //         <div class='confirmInfo'>
                    //             <span class='labelSelect-title'>已选择的数据量过大，等待时间较长，是否继续？</span>
                    //         </div>
                    //     </div>
                    //     <div class='btnBox'>
                    //         <div class='btn-confirm'>
                    //             <a href='javascript:;' @click='confirm'>继续</a>
                    //         </div>
                    //         <div class='btn-cancel'>
                    //             <a class='labelCloseBtn' href='javascript:;'>取消</a>
                    //         </div>
                    //     </div>
                    // </div>`;
                    // var batchOperConfirm = layer.open({
                    //     type: 1,
                    //     zIndex: 99999999,
                    //     title: false,
                    //     closeBtn: 0,
                    //     content: _html,
                    //     area: ['4.24rem', '3.07rem'],
                    //     success: function (index, o) {
                    //         batchOperConfirmVue = new Vue({
                    //             el: "#batchOperConfirm",
                    //             data: {},
                    //             mounted:function (){
                    //                 _this = this
                    //             },
                    //             methods:{
                    //                 //关闭弹窗
                    //                 close_layer:function(){
                    //                     layer.close(batchOperConfirm);
                    //                     batchOperConfirm=null;
                    //                     _this = null;
                    //                     event = null;
                    //                     batchOperConfirmVue = null;
                    //                 },
                    //                 confirm(){
                    //                     vm.batchCollectionRequest1();
                    //                     this.close_layer();
                    //                 }
                    //             }
                    //         })
                    //         //关闭
                    //         $('.labelIcon').click(function(){
                    //             layer.close(batchOperConfirm);
                    //             batchOperConfirm=null;
                    //                 _this = null;
                    //                 event = null;
                    //                 batchOperConfirmVue = null;
                    //         });
                    //         $('.labelCloseBtn').click(function(){
                    //             layer.close(batchOperConfirm);
                    //             batchOperConfirm=null;
                    //             _this = null;
                    //             event = null;
                    //             batchOperConfirmVue = null;
                    //         });
                    //     },
                    //     cancel: function (index, layero) {
                    //         layer.close(index);
                    //         batchOperConfirm=null;
                    //         _this = null;
                    //         event = null;
                    //         batchOperConfirmVue = null;
                    //         return false;
                    //     }
                    // })
                    // return;
                }
                const _state = 3;
                const li = list.map(function (v) {
                    return {
                        state: _state,
                        deviceID: v.type == 102 ? (v.deviceID ? v.deviceID : v.id) : v.id,
                        userId: $("#userInfoId").val(),
                        menuType: v.menuType,
                        type: v.type,
                        thirdparty: v.thirdparty || 'monitor'
                    }
                });
                // console.log(li);
                this.batchCollectionRequest(li, _state, function () {
                    vm.layerLoading = layer.load();
                    vm.getList();
                });
            },
            /**批量关联标签**/
            batchSetRelatedness: function (operationType, deviceID) {
                // operationType：操作类型 0单个 1批量; deviceID：设备ID；
                var _this = this,
                    relatednessLayertVue;
                let list = [];
                if (operationType == 1) {
                    if (this.batchOperOption == '0') { //选中数据
                        list = this.deviceList.filter(i => i.checked);
                        if (!list.length) {
                            layer.msg("请选中至少一个终端");
                            return;
                        };
                    } else if (this.batchOperOption == '1') { //当前页数据
                        // list = this.deviceList
                        list = this.deviceList.filter(i => i.checked);
                        if (!list.length) {
                            layer.msg("请选中至少一个终端");
                            return;
                        };
                    }
                }
                // 关联标签弹框
                var _html =
                    "<div id='relatednessLayer1' class='editLabel1 relatednessLayer1'>\
                            <div class='labelTitle'>关联标签<a class='labelIcon' href='javascript:;'></a></div>\
                            <div class='relatedContent assocLabel'>\
                                <div class='labelSelect labelSelect20'>\
                                    <span class='labelSelect-title'>标签选择</span>\
                                </div>\
                                <div class='labelSelect labelSelect80'>\
                                    <select class='labelSelect-select' v-model='firstLabelId' @change='getSecondLayer'>\
                                        <option value='' key='-1' title='请选择一级标签'>请选择一级标签</option>\
                                        <option v-for='(item,index) in firstLabel' :value='item.labelId' :key='index' :title='item.name'>{{item.name}}</option>\
                                    </select>\
                                    <select class='labelSelect-select' v-model='secondLabelId' v-show='secondLabelShow'>\
                                        <option value='' key='-1' title='请选择二级标签'>请选择二级标签</option>\
                                        <option v-for='(item,index) in secondLabel' :value='item.labelId' :key='index' :title='item.name'>{{item.name}}</option>\
                                    </select>\
                                </div>\
                            </div>\
                            <div class='btnBox'>\
                                <div class='btn-confirm'>\
                                    <a href='javascript:;' @click='createLabelDevice'>保存</a>\
                                </div>\
                                <div class='btn-cancel'>\
                                    <a class='labelCloseBtn' href='javascript:;'>取消</a>\
                                </div>\
                            </div>\
                        </div>";
                var relatednessLayer1 = layer.open({
                    type: 1,
                    // zIndex: 99999999,
                    title: false,
                    closeBtn: 0,
                    content: _html,
                    area: ['4.24rem', '3.07rem'],
                    success: function (index, o) {
                        relatednessLayertVue = new Vue({
                            el: "#relatednessLayer1",
                            data: {
                                firstLabel: [], // 第一级标签
                                firstLabelId: '', // 关联标签选的一级标签
                                secondLabelShow: false, //第二级标签选择框
                                secondLabel: [], // 第二级标签
                                secondLabelId: '', // 关联标签选的一级标签
                            },
                            mounted: function () {
                                _this = this
                                _this.getAllLayer()
                            },
                            methods: {
                                //关闭弹窗
                                close_layer: function () {
                                    layer.close(relatednessLayer1);
                                    relatednessLayer1 = null;
                                    _this = null;
                                    event = null;
                                    relatednessLayertVue = null;
                                },
                                getAllLayer () {
                                    var _this = this;
                                    var load = layer.load();
                                    $.ajax({
                                        url: 'labelManage/getLabelTreeByPid.do?labelId=0',
                                        type: 'get',
                                        dataType: 'json',
                                        success: function (data) {
                                            layer.close(load);
                                            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                                    closeBtn: 0
                                                }, function () {
                                                    location.reload();
                                                });
                                                return;
                                            }
                                            if (data.result) {
                                                _this.firstLabel.splice(0, _this.firstLabel.length);
                                                _this.firstLabel = data.data.filter(item => item.level == 1)
                                            }
                                        },
                                        error: function (data) {
                                            layer.close(load);
                                            layer.msg(data.msg);
                                        }
                                    });
                                },
                                getSecondLayer () {
                                    var _this = this;
                                    var load = layer.load();
                                    $.ajax({
                                        url: 'labelManage/getLabelTreeByPid.do?labelId=' + _this.firstLabelId,
                                        type: 'get',
                                        dataType: 'json',
                                        success: function (data) {
                                            layer.close(load);
                                            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                                    closeBtn: 0
                                                }, function () {
                                                    location.reload();
                                                });
                                                return;
                                            }
                                            if (data.result) {
                                                _this.secondLabel.splice(0, _this.secondLabel.length);
                                                _this.secondLabel = data.data
                                                // 如果一级标签下有二级标签，则显示二级标签的选择框
                                                _this.secondLabelShow = data.data.length;
                                            }
                                        },
                                        error: function (data) {
                                            layer.close(load);
                                            layer.msg(data.msg);
                                        }
                                    });
                                },
                                //按条件搜索全部关联 请求
                                batchSetRelatednessRequest1 (callback) {
                                    var params = {
                                        platformID: vm.platformID,
                                        removeIds: vm.exceptionArray.filter(i => i && i.trim()).join(","), //排除在外的设备ID
                                        Ids: '', // 设备主键ID,拼接的id串
                                        deleteType: 1, // 1:全部（按照条件删除） 其他：通过ids删除
                                        menuType: vm.terminalType, // 设备分类大类型大菜单类型
                                        number: vm.terminalNum, // 设备号码
                                        deviceName: vm.terminalName, // 设备名称
                                        equipmentId: vm.regionId, // 当前选择的行政区域ID
                                        source: vm.source, // 设备来源标识 默认0
                                        gradeid: vm.city_gradeid, // 当前行政区域层级
                                        lngAndLatType: vm.lngAndLatType, // 	经纬度状态 默认0 ：全部 1：正常 2：异常
                                        userId: vm.userInfoId, // 当前登录用户ID
                                        isCheckLngAndLat: true, // 是否过滤经纬度不正常的终端 默认true
                                        type: vm.searchTerType == 0 ? "" : vm.searchTerType, // 设备分类小类型
                                        lableId: _this.secondLabelId == '' ? _this.firstLabelId : _this.secondLabelId, // 标签ID
                                        action: 'labelManage/createLabelDevicesByParam.do',
                                    };
                                    for (prop in params) {
                                        if (params[prop] === '' || params[prop] === undefined) {
                                            delete params[prop];
                                        }
                                    }
                                    // console.log("全部关联",params);
                                    var loadDev = layer.load();
                                    ajaxdata(params, function (result, data) {
                                        layer.close(loadDev);
                                        if (result) {
                                            layer.msg("关联成功");
                                            typeof callback == "function" && callback();
                                            vm.getList();
                                        } else {
                                            layer.msg(data.msg);
                                        }
                                    });
                                },
                                //设备与标签关联
                                createLabelDevice () {
                                    var _this = this;
                                    if (_this.firstLabelId == '') {
                                        layer.msg("请选择一级标签");
                                    } else if (_this.secondLabelShow && _this.secondLabelId == '') {
                                        layer.msg("请选择二级标签");
                                    } else {
                                        let saveDataArr = []
                                        if (operationType == 0) {
                                            let saveDataObj = { "labelId": "", "deviceId": "" };
                                            saveDataObj.labelId = _this.secondLabelId == '' ? _this.firstLabelId : _this.secondLabelId
                                            saveDataObj.deviceId = `${deviceID}`
                                            saveDataArr.push(saveDataObj)
                                        } else {
                                            list.forEach((item, index) => {
                                                let saveDataObj = { "labelId": "", "deviceId": "" };
                                                saveDataObj.labelId = _this.secondLabelId == '' ? _this.firstLabelId : _this.secondLabelId
                                                if (item.type == '102') {
                                                    saveDataObj.deviceId = item.deviceID ? `${item.deviceID}` : `${item.id}`;
                                                } else {
                                                    saveDataObj.deviceId = `${item.id}`;
                                                }
                                                saveDataArr.push(saveDataObj)
                                            });
                                        }
                                        // console.log("关联标签-----",saveDataArr)

                                        if (vm.batchOperOption == '2') { //按条件搜索全部关联
                                            if ((vm.allDataNum - vm.exceptionArray.length) < 10000) {
                                                this.batchSetRelatednessRequest1();
                                                this.close_layer();
                                            } else {
                                                layer.msg("单个类型关联标签上限为1万，当前选中数据已超出上限，请减少数据再关联");
                                            }
                                            return;
                                            // // 全部关联确认弹窗
                                            // var _html =
                                            // `<div id='batchOperConfirm' class='editLabel1 relatednessLayer1'>
                                            //     <div class='labelTitle'>批量关联<a class='labelIcon' href='javascript:;'></a></div>
                                            //     <div class='relatedContent assocLabel'>
                                            //         <div class='confirmInfo'>
                                            //             <span class='labelSelect-title'>已选择的数据量过大，等待时间较长，是否继续？</span>
                                            //         </div>
                                            //     </div>
                                            //     <div class='btnBox'>
                                            //         <div class='btn-confirm'>
                                            //             <a href='javascript:;' @click='confirm'>继续</a>
                                            //         </div>
                                            //         <div class='btn-cancel'>
                                            //             <a class='labelCloseBtn' href='javascript:;'>取消</a>
                                            //         </div>
                                            //     </div>
                                            // </div>`;
                                            // var batchOperConfirm = layer.open({
                                            //     type: 1,
                                            //     // zIndex: 99999999,
                                            //     title: false,
                                            //     closeBtn: 0,
                                            //     content: _html,
                                            //     area: ['4.24rem', '3.07rem'],
                                            //     success: function (index, o) {
                                            //         batchOperConfirmVue = new Vue({
                                            //             el: "#batchOperConfirm",
                                            //             data: {},
                                            //             mounted:function (){
                                            //                 _this = this
                                            //             },
                                            //             methods:{
                                            //                 //关闭弹窗
                                            //                 close_layer:function(){
                                            //                     layer.close(batchOperConfirm);
                                            //                     batchOperConfirm=null;
                                            //                     _this = null;
                                            //                     event = null;
                                            //                     batchOperConfirmVue = null;
                                            //                 },
                                            //                 confirm(){
                                            //                     relatednessLayertVue.batchSetRelatednessRequest1();
                                            //                     this.close_layer();
                                            //                     relatednessLayertVue.close_layer();
                                            //                 }
                                            //             }
                                            //         })
                                            //         //关闭
                                            //         $('.labelIcon').click(function(){
                                            //             layer.close(batchOperConfirm);
                                            //             batchOperConfirm=null;
                                            //                 _this = null;
                                            //                 event = null;
                                            //                 batchOperConfirmVue = null;
                                            //         });
                                            //         $('.labelCloseBtn').click(function(){
                                            //             layer.close(batchOperConfirm);
                                            //             batchOperConfirm=null;
                                            //             _this = null;
                                            //             event = null;
                                            //             batchOperConfirmVue = null;
                                            //         });
                                            //     },
                                            //     cancel: function (index, layero) {
                                            //         layer.close(index);
                                            //         batchOperConfirm=null;
                                            //         _this = null;
                                            //         event = null;
                                            //         batchOperConfirmVue = null;
                                            //         return false;
                                            //     }
                                            // })
                                            // return;
                                        }
                                        var loadDev = layer.load();
                                        $.ajax({
                                            url: `labelManage/createLabelDevices.do?menuType=${vm.terminalType}&lableId=${relatednessLayertVue.secondLabelId == '' ? relatednessLayertVue.firstLabelId : relatednessLayertVue.secondLabelId}`,
                                            type: 'POST',
                                            dataType: 'json',
                                            contentType: "application/json;charset=UTF-8",
                                            data: JSON.stringify(saveDataArr),
                                            success: function (data) {
                                                layer.close(loadDev);
                                                if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                                    layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                                        closeBtn: 0
                                                    }, function () {
                                                        location.reload();
                                                    });
                                                    return;
                                                }
                                                if (data.result) {
                                                    layer.msg(data.msg);
                                                    //关闭弹框
                                                    _this.close_layer();
                                                } else {
                                                    layer.msg(data.msg);
                                                }
                                                _this.firstLabelId = '';
                                                _this.secondLabelId = '';
                                            },
                                            error: function (data) {
                                                layer.msg(data.msg);
                                            }
                                        })
                                    }
                                }
                            }
                        })
                        //关闭
                        $('.labelIcon').click(function () {
                            layer.close(relatednessLayer1);
                            relatednessLayer1 = null;
                            _this = null;
                            event = null;
                            relatednessLayertVue = null;
                        });
                        $('.labelCloseBtn').click(function () {
                            layer.close(relatednessLayer1);
                            relatednessLayer1 = null;
                            _this = null;
                            event = null;
                            relatednessLayertVue = null;
                        });
                    },
                    cancel: function (index, layero) {
                        layer.close(index);
                        relatednessLayer1 = null;
                        _this = null;
                        event = null;
                        relatednessLayertVue = null;
                        return false;
                    }
                });
            },
            /**删除用户**/
            deleteUser: function () {
                //去掉最后一个逗号  
                var this_deleteArray = (this.deleteArray != 'null' || this.deleteArray) ? this.deleteArray.substr(0, this.deleteArray.length - 1) : "";
                var delid = this_deleteArray.split(","), //转换为数组
                    i = 0, //索引
                    flag = 1, //判断是否选中了导入数据
                    idlength = delid.length; //长度
                for (; i < idlength; i++) {
                    if (delid[i] == "null") {
                        flag = 0;
                    }
                }
                //标签管理走这里zu做
                // if(this.indexNum==7){
                if (this.indexNum == 8) {
                    this.deleteData(this.deleteArray);
                    return;
                    // } else if (this.indexNum==8) {
                } else if (this.indexNum == 3) {
                    var delArr = [];
                    this.deviceList.forEach(function (item, index) {
                        var obj = {};
                        if (item.checked) {
                            obj.id = item.id;
                            obj.userId = item.userId;
                            delArr.push(obj);
                        }
                    });
                    this.delTVwallData(delArr);
                    return;
                } else if (this.indexNum == 9) {
                    this.deletePlan(this.deleteArray);
                    return;
                }
                if (flag) {
                    this.removePopup(this.deleteArray);
                } else {
                    layer.msg("此数据为第三方数据，您没有删除权限!");
                }

            },
            // 点击全国显示全国数据
            getWholeCountry: function () {
                this.regionId = "000000000000";
                this.platformID = ""
                this.city_gradeid = "";
                this.ificationClick(this.indexNum);
            },
            getWholeCountryPhone: function () {
                if ((this.indexNum == 2 && this.isShowEnterprise) || this.indexNum == 1) {
                    this.regionId = "000000000000";
                    this.platformID = ""
                    this.city_gradeid = "";
                    this.ificationClick(this.indexNum);
                }
            },
            getRegionNameOrNum () {
                var that = this;
                let menuType = 1; // 1：终端 2：监控 5：移动终端 6：其他
                switch (this.indexNum) {
                    case 0:
                        menuType = 1
                        break;
                    case 1:
                        menuType = 2
                        break;
                    case 2:
                        menuType = 5
                        break;
                    default:
                        menuType = 6
                        break;
                }
                var object = {
                    action: "organization/getOrganizationCurrentWithRC.do",
                    id: this.regionId,
                    menuType,
                    platformID: this.platformID,
                };
                ajaxdata(object, function (result, data) {
                    if (result) {
                        that.city_gradeid = data.list[0].gradeid;
                        that.regionName = data.list[0].name;
                        that.rootNodeData = data.list[0];
                        if (menuType == 5) {
                            // 移动终端
                            that.regionNum = data.list[0].rc ? data.list[0].rc.pC : null;
                        } else {
                            that.regionNum = data.list[0].rc ? data.list[0].rc.dC : null;
                        }
                    } else {
                        layer.msg("<p style='text-align:center'>查询失败!</p>");
                    }
                });
            },
            // 侧边栏树
            getTreeData: function (id, labelType, newIndexVal) {
                var that = this;
                let menuType = 1; // 1：终端 2：监控 5：移动终端 6：其他
                switch (this.indexNum) {
                    case 0:
                        menuType = 1
                        break;
                    case 1:
                        menuType = 2
                        break;
                    case 2:
                        menuType = 5
                        break;
                    default:
                        menuType = 6
                        break;
                }
                if (menuType !== 5 || (menuType == 5 && !that.isShowEnterprise)) {
                    var object = {
                        // action: "organization/list.do",
                        action: newIndexVal === 'index===1' ? 'organization/listWithRCAndRole.do' : "organization/listWithRC.do",
                        id: this.regionId,
                        menuType,
                        platformID: this.platformID,
                    };
                    vm.layerLoading = layer.load();
                    ajaxdata(object, function (result, data) {
                        layer.close(vm.layerLoading);
                        if (result) {
                            if (that.firstEnter) {
                                that.regionNum = data.parentRegion ? data.parentRegion.rc.dCO + '/' + data.parentRegion.rc.dC : null;
                            }
                            if (that.firstEnter) {
                                var setting = '';
                                if (vm.indexNum != 1) {
                                    that.noTreeFlag = false;
                                    setting = {
                                        view: {
                                            showLine: false, //是否显示节点之间的连线
                                            showIcon: false,
                                            showTitle: false, //是否显示悬停信息
                                            expandSpeed: "fast", //速度
                                            selectedMulti: false, //设置是否允许同时选中多个节点
                                        },
                                        data: {
                                            key: {
                                                title: "name"
                                            },
                                            simpleData: {
                                                enable: true,
                                                idKey: "id", //节点数据中保存唯一标识的属性名称。
                                                pIdKey: "pid" //节点数据中保存其父节点唯一标识的属性名称。
                                            }
                                        },
                                        callback: {
                                            onExpand: vm.zTreeOnExpand,
                                            onClick: vm.getChildNodesClick //点击树节点时触发
                                        }
                                    };
                                } else {
                                    if (data.list.length == 0) {
                                        that.noTreeFlag = true;
                                    }
                                    setting = {
                                        view: {
                                            showLine: false, //是否显示节点之间的连线
                                            showIcon: false,
                                            showTitle: false, //是否显示悬停信息
                                            expandSpeed: "fast", //速度
                                            selectedMulti: false, //设置是否允许同时选中多个节点
                                        },
                                        data: {
                                            key: {
                                                title: "name"
                                            },
                                            simpleData: {
                                                enable: true,
                                                idKey: "rowId", //节点数据中保存唯一标识的属性名称。
                                                pIdKey: "pid" //节点数据中保存其父节点唯一标识的属性名称。
                                            }
                                        },
                                        callback: {
                                            onExpand: vm.zTreeOnExpand,
                                            onClick: vm.getChildNodesClick //点击树节点时触发
                                        }
                                    };
                                }
                            }
                            if (id != "000000000000") {
                                var treeObj = $.fn.zTree.getZTreeObj("treeDemo"); // 传入参数为ul的id
                                if (!that.firstEnter) {
                                    if (vm.indexNum != 1) {
                                        var parentNode = treeObj.getNodeByParam("id", vm.regionId); // 也可以用其他方式获得父节点
                                    } else {
                                        var parentNode = treeObj.getNodeByParam("rowId", vm.rowId); // 也可以用其他方式获得父节点
                                    }
                                }
                                vm.treeList = [];
                                // 遍历获得的子节点数据
                                for (var i = 0; i < data.list.length; i++) {
                                    data.list[i].isParent = true;
                                    if (data.list[i].gradeid < 4 && data.list[i].rc instanceof Object) {
                                        // data.list[i].name = data.list[i].name +'('+ data.list[i].rc.aC + ')';
                                        if (that.indexNum == 0) {
                                            data.list[i].name = data.list[i].name + '(' + data.list[i].rc.dCO + '/' + data.list[i].rc.dC + ')';
                                        } else if (that.indexNum == 1) {
                                            data.list[i].name = data.list[i].name + '(' + data.list[i].rc.mC + ')';
                                        } else if (that.indexNum == 2 && menuType == 5) {
                                            data.list[i].name = data.list[i].name;
                                        } else if (that.indexNum == 2) {
                                            data.list[i].name = data.list[i].name + '(' + data.list[i].rc.pC + ')';
                                        }
                                    } else {
                                        // 增加的indexNum == 1的时候，对节点树的数据拼接进行的修改
                                        if (that.indexNum == 1) {
                                            data.list[i].name = data.list[i].name
                                        } else {
                                            data.list[i].name = `${data.list[i].name}(${data.list[i].rc === null ? '0/0' : data.list[i].rc.dCO + '/' + data.list[i].rc.dC})`
                                        }
                                    }
                                    vm.treeList.push(data.list[i]);
                                }
                                // 将得到的子节点数据放入点击的父节点当中去
                                if (that.firstEnter) {
                                    //init初始化中要加入id名称、对象、 数组
                                    $.fn.zTree.init($("#treeDemo"), setting, vm.treeList);
                                } else {
                                    treeObj.addNodes(parentNode, vm.treeList); //天假
                                }
                            } else {
                                // 默认将所有省设为父节点 这样可以默认显示箭头图标
                                for (var i = 0; i < data.list.length; i++) {
                                    data.list[i].isParent = true;
                                    if (data.list[i].rc instanceof Object) {
                                        // data.list[i].name = data.list[i].name +'('+ data.list[i].rc.aC + ')';
                                        if (that.indexNum == 0) {
                                            data.list[i].name = data.list[i].name + '(' + data.list[i].rc.dCO + '/' + data.list[i].rc.dC + ')';
                                        } else if (that.indexNum == 1) {
                                            // 处理节点多拼接括号的问题 yx 2022年7月29日17:12:40
                                            // data.list[i].name = data.list[i].name + '(' + data.list[i].rc.mC + ')';
                                            data.list[i].name = data.list[i].name;
                                        } else if (that.indexNum == 2 && menuType == 5) {
                                            data.list[i].name = data.list[i].name;
                                        } else if (that.indexNum == 2) {
                                            data.list[i].name = data.list[i].name + '(' + data.list[i].rc.pC + ')';
                                        }
                                    }
                                    vm.treeList.push(data.list[i]);
                                }
                                //init初始化中要加入id名称、对象、 数组
                                $.fn.zTree.init($("#treeDemo"), setting, vm.treeList);
                            }
                            // 获取分类数据方法
                            // vm.ificationClick(vm.indexNum);
                            if (!that.isCurTab) {
                                vm.ificationClick(vm.indexNum);
                            }
                            console.log('noTreeFlag', that.noTreeFlag, vm.indexNum);
                            that.firstEnter = false;
                        } else {
                            layer.msg("<p style='text-align:center'>查询失败!</p>");
                        }
                    });
                } else {
                    //    当前为移动终端，来源为自动获取（企业）
                    that.requestTree();
                }
            },
            //根据行政区域编码查询子目录及编码下用户 移动终端列表
            requestTree: function () {
                let that = this;
                if (that.firstEnter) {
                    //超管 管理员
                    if ($("#userInfoId").attr("data-permission") != 2) {
                        that.regionId = '000000000000';
                    } else {
                        that.regionId = $("#userInfoId").attr("data-regionbId");
                    }
                }
                var obj = {
                    "code": that.regionId,
                    "enterprise_id": that.enterpriseIDSel,
                    "type": 0,
                };
                $.ajax({
                    url: 'p_server_api/get_catalogs_and_contacts.do',
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(obj),
                    contentType: "application/json;charset=UTF-8",
                    success: function (json) {
                        if (json.result == "ok") {
                            that.treeList = [];
                            var treeObj = $.fn.zTree.getZTreeObj("treeDemo"); // 传入参数为ul的id
                            if (!that.firstEnter) {
                                var parentNode = treeObj.getNodeByParam("id", that.regionId); // 也可以用其他方式获得父节点
                            }
                            var setting = {
                                view: {
                                    showLine: false, //是否显示节点之间的连线
                                    showIcon: false,
                                    showTitle: false, //是否显示悬停信息
                                    expandSpeed: "fast", //速度
                                    selectedMulti: false, //设置是否允许同时选中多个节点
                                },
                                data: {
                                    key: {
                                        title: "name"
                                    },
                                    simpleData: {
                                        enable: true,
                                        idKey: "id", //节点数据中保存唯一标识的属性名称。
                                        pIdKey: "pid" //节点数据中保存其父节点唯一标识的属性名称。
                                    }
                                },
                                callback: {
                                    onExpand: vm.zTreeOnExpand,
                                    onClick: vm.getChildNodesClick //点击树节点时触发
                                }
                            };
                            let treeParentArr = [];
                            if (json.data.catalog_list.length > 0) {
                                that.treeList = json.data.catalog_list.map((item) => {
                                    return {
                                        id: item.id,
                                        isLeaf: false,
                                        name: `${item.name}(${item.online}/${item.count})`,
                                        pid: item.parent_code,
                                        isParent: true
                                    }
                                })
                            } else {
                                that.treeList = [];
                            }
                            //init初始化中要加入id名称、对象、 数组
                            if (that.firstEnter) {
                                //init初始化中要加入id名称、对象、 数组
                                $.fn.zTree.init($("#treeDemo"), setting, vm.treeList);
                            } else {
                                treeObj.addNodes(parentNode, vm.treeList); //添加
                            }
                            if (!that.isCurTab) {
                                vm.ificationClick(vm.indexNum);
                            }
                            that.firstEnter = false;
                        } else {
                            layer.msg(json.msg);
                        }
                    },
                    error: function (fail) {

                    }
                });
            },
            // 第一次展开事件
            zTreeOnExpand: function (event, treeId, treeNode) {
                this.regionId = treeNode.id;
                this.platformID = treeNode.platformID || "";
                this.rowId = treeNode.rowId;
                if (typeof treeNode.children == "undefined") { //第一次点展开按钮 如果没有子节点
                    this.getTreeData(treeNode.id, treeNode); //加载侧边栏树（添加节点）
                }
            },
            //点击左侧树节点的方法
            getChildNodesClick: function (e, treeId, treeNode, clickFlag) {
                if (this.treeNodeTid != '') {
                    $('#' + this.treeNodeTid + '_span').css("color", "#FFFFFF");
                }
                this.isCurTab = false;
                console.log('treeNode', treeNode);
                this.rowId = treeNode.rowId;
                this.regionId = treeNode.id;
                this.platformID = treeNode.platformID || "";
                this.city_gradeid = treeNode.gradeid
                this.treeNodeTid = treeNode.tId;
                if (treeNode.gradeid == 5) {
                    $('#' + treeNode.tId + '_span').css("color", "#00FFFF");
                }
                //console.log(this.regionId)
                this.deleteChileNodes(treeNode); //先删除该节点下的所有子节点
            },
            //用字体颜色区分提资状态
            getFont (treeId, node) {
                console.log('node', node);
                var $state = node.state;
                if ($state == 0) {
                    return { "color": "black" };
                } else if ($state == 1) {
                    return { "color": "#00FFFF", "font-weight": "bold" };
                } else {
                    return { "color": "#FFFFFF" };
                }
            },
            //删除子节点
            deleteChileNodes: function (treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo"); //定义树的dom
                //var nodes = treeObj.getSelectedNodes(); //获取 zTree 当前被选中的节点数据集合
                if (typeof treeNode.children == "undefined") { //如果没有子节点
                    if (this.isCurTab) {
                        treeObj.removeChildNodes(treeNode);
                        return;
                    } else {
                        treeObj.removeChildNodes(treeNode); //删除treeNode下的所有子节点。
                        this.getTreeData(treeNode.id, treeNode, vm.indexNum === 1 ? 'index===1' : undefined); //加载侧边栏树（添加节点）
                        //				 	console.log(treeNode);
                    }

                } else { //子节点的话就不再请求树的省市区数据 直接获取id并请求右侧数据
                    treeObj.expandNode(treeNode); //展开/收起
                    // if(treeNode.open == true){//展开状态下是true  收起状态是false
                    this.ificationClick(this.indexNum);
                    // }
                    //			   		console.log(treeNode);
                }
            },
            // 关键字搜索
            keywordSearch: function () {
                this.ificationClick(this.indexNum);
            },
            // 视频通讯、视频监控、移动终端切换改变按钮颜色
            classificationClick: function (index) {
                console.log(index)
                console.log(this.indexNum)
                var that = this;
                this.isShowEnterprise = false;
                this.layerLoading = layer.load();
                if (this.indexNum == 9) {
                    this.searchPlanName = "";
                } else if (this.indexNum == 8) {
                    this.searchLableName = '';
                } else if (this.indexNum == 3) {
                    this.searchTVWallName = '';
                }
                // if(index==2 && this.isShowEnterprise) {
                if (index == 2) {
                    this.isShowEnterprise = true;
                    //if是自动获取 if是收到获取 isShowEnterprise:true auto 自动获取的掌上通（流媒体接口）；isShowEnterprise:false Manual 收到获取（本地添加）
                    vm.getEnterpriseList();
                }
                this.deleteArray = "";
                this.exceptionArray = [];
                this.batchOperOption = '0';
                this.selectSwitchVal = "1";
                this.indexNum = index;
                var setting = '';
                if (vm.indexNum != 1) {
                    setting = {
                        view: {
                            showLine: false, //是否显示节点之间的连线
                            showIcon: false,
                            showTitle: false, //是否显示悬停信息
                            expandSpeed: "fast", //速度
                            selectedMulti: false, //设置是否允许同时选中多个节点
                        },
                        data: {
                            key: {
                                title: "name"
                            },
                            simpleData: {
                                enable: true,
                                idKey: "id", //节点数据中保存唯一标识的属性名称。
                                pIdKey: "pid" //节点数据中保存其父节点唯一标识的属性名称。
                            }
                        },
                        callback: {
                            onExpand: vm.zTreeOnExpand,
                            onClick: vm.getChildNodesClick //点击树节点时触发
                        }
                    };
                } else {
                    setting = {
                        view: {
                            showLine: false, //是否显示节点之间的连线
                            showIcon: false,
                            showTitle: false, //是否显示悬停信息
                            expandSpeed: "fast", //速度
                            selectedMulti: false, //设置是否允许同时选中多个节点
                        },
                        data: {
                            key: {
                                title: "name"
                            },
                            simpleData: {
                                enable: true,
                                idKey: "rowId", //节点数据中保存唯一标识的属性名称。
                                pIdKey: "pid" //节点数据中保存其父节点唯一标识的属性名称。
                            }
                        },
                        callback: {
                            onExpand: vm.zTreeOnExpand,
                            onClick: vm.getChildNodesClick //点击树节点时触发
                        }
                    };
                }
                // yx 视频监控的方法
                if (index == 0 || index == 1 || index == 2) {
                    if (index === 1) {
                        this.isCurTab = true;
                        vm.treeList = [];
                        this.platformID = "";
                        this.rowId = '';
                        this.firstEnter = true;
                        $.fn.zTree.init($("#treeDemo"), setting, vm.treeList);
                        this.regionId = "000000000000";
                        this.getTreeData(this.regionId, '', 'index===1');
                        //获取当前自动同步监控开关的状态
                        vm.getMonitoringUpSwitch();
                    } else {
                        this.isCurTab = true;
                        vm.treeList = [];
                        this.platformID = "";
                        this.rowId = '';
                        this.firstEnter = true;
                        $.fn.zTree.init($("#treeDemo"), setting, vm.treeList);
                        if (index == 1) {
                            this.regionId = "000000000000";
                        } else {
                            if (this.permission != 0 && this.permission != 1) {
                                //普通用户
                                this.regionId = $("#regionbId").val();
                                this.getRegionNameOrNum();
                            } else {
                                //超管
                                this.regionId = "000000000000";
                            }
                        }
                        this.getTreeData(this.regionId);
                        //获取当前自动同步监控开关的状态
                        vm.getMonitoringUpSwitch();
                    }
                    // 加载左侧树结构
                    // this.getTreeData(this.regionId);
                }
                setTimeout(function () {
                    that.ificationClick(that.indexNum);
                }, 200)
                vm.lngAndLatType = 0;
            },
            //回车查询
            goSearch: function (obj) {
                if (obj.keyCode == 13) {
                    this.getScreenData();
                }
            },
            // 获取分类数据
            ificationClick: function (index) {
                console.log(index)
                this.pageNum = 1; //每次查询从第一页开始
                if (index == 0) { //视频通信
                    this.terminalType = 1; //保存类型(视频通信、视频监控、移动终端)用于搜索功能
                    if (this.selectSwitchVal == 1) { //终端号码
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) { //终端名称
                        this.terminalNum = "";
                        this.getList();
                    }
                    this.equipmentSearchInfo = ['终端号码', '终端名称'];
                } else if (index == 1) { //视频监控
                    this.terminalType = 2;
                    if (this.selectSwitchVal == 1) {
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) {
                        this.terminalNum = "";
                        this.getList();
                    }
                    this.equipmentSearchInfo = ['监控号码', '监控名称'];
                } else if (index == 2) { //移动终端
                    this.terminalType = 5;
                    if (this.selectSwitchVal == 1) {
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) {
                        this.terminalNum = "";
                        this.getList();
                    }
                    this.equipmentSearchInfo = ['移动终端号码', '移动终端名称'];
                } else if (index == 3) {//电视墙
                    this.terminalType = "";
                    this.terminalName = "";
                    this.terminalNum = "";
                    this.getList();
                    this.equipmentSearchInfo = ['终端名称'];
                } else if (index == 4) { //三维街景
                    this.terminalType = 6;
                    if (this.selectSwitchVal == 1) {
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) {
                        this.terminalNum = "";
                        this.getList();
                    }
                } else if (index == 5) { //常用设备
                    this.terminalType = "";
                    if (this.selectSwitchVal == 1) {
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) {
                        this.terminalNum = "";
                        this.getList();
                    }
                    this.equipmentSearchInfo = ['终端号码', '终端名称'];
                } else if (index == 6) { //收藏设备
                    this.terminalType = "";
                    if (this.selectSwitchVal == 1) {
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) {
                        this.terminalNum = "";
                        this.getList();
                    }
                    this.equipmentSearchInfo = ['设备号码', '设备名称'];
                } else if (index == 7) { //监控轮询
                    this.terminalType = "";
                    if (this.selectSwitchVal == 1) {
                        this.terminalName = "";
                        this.getList();
                    } else if (this.selectSwitchVal == 2) {
                        this.terminalNum = "";
                        this.getList();
                    }
                } else if (index == 8) { //标签管理
                    this.terminalType = "";
                    //获取标签管理数据
                    layer.close(this.layerLoading);
                    this.terminalName = "";
                    this.terminalNum = "";
                    this.getList();
                    this.equipmentSearchInfo = ['标签名称'];
                } else if (index == 9) { //监控预案
                    this.terminalType = "";
                    this.terminalName = "";
                    this.terminalNum = "";
                    this.getList();
                    layer.close(this.layerLoading);
                    // this.equipmentSearchInfo=['监控号码','监控名称','预案名称'];
                    this.equipmentSearchInfo = ['预案名称'];
                }
                terminalType = this.terminalType;
            },
            getWholeCity () {
                this.city_gradeid = this.rootNodeData.gradeid;
                if (this.indexNum == 1) {
                    this.regionId = "000000000000"
                } else {
                    this.regionId = $("#regionbId").val();
                }
                if (this.treeNodeTid != '') {
                    $('#' + this.treeNodeTid + '_span').css("color", "#FFFFFF");
                }
                this.getList();
            },
            againGetallClassifyOptionList () {
                let that = this
                if (this.terminalType == "" && this.indexNum == 9) {
                    this.allClassifyOptionList = [
                        { id: 0, name: '全部分类' },
                        { id: 0, name: '未分类' },
                    ]
                    $.ajax({
                        url: '/gisPlatform/planType/list.do',
                        type: 'get',
                        success: function (res) {
                            if (res.result && res.data && res.data.length > 0) {
                                that.allClassifyOptionList = that.allClassifyOptionList.concat(res.data)
                            } else {
                                that.allClassifyOptionList = that.allClassifyOptionList
                            }
                        }
                    })
                }
            },
            // 搜索请求数据
            getList: function () {
                let that = this
                var _this = this;
                this.againGetallClassifyOptionList()
                var listUrl;
                if (this.terminalType == "" && this.indexNum == 3) {
                    //电视墙
                    listUrl = "tvWallManage/selectTVWallList.do";
                } else if (this.terminalType == "" && this.indexNum == 5) {
                    //常用设备接口
                    listUrl = "device/getOftenList.do";
                } else if (this.terminalType == "" && this.indexNum == 6) {
                    //收藏设备接口
                    listUrl = "device/getCollectList.do";
                } else if (this.terminalType == "" && this.indexNum == 7) {
                    //监控轮询
                    listUrl = "device/getRoundRobinList.do";
                } else if (this.terminalType == "" && this.indexNum == 8) {
                    //标签管理
                    // listUrl = "labelManage/selectLabelList.do";
                    listUrl = "labelManage/getLabelManageList.do";
                } else if (this.terminalType == "" && this.indexNum == 9) {
                    //监控预案
                    listUrl = "planPolling/getPlanPolling.do";
                } else if (this.terminalType == 5 && this.indexNum == 2) {
                    //移动终端
                    listUrl = 'device/getNewManagementList.do';//获取本地添加的数据
                } else if (this.terminalType === 2 && this.indexNum === 1) {
                    // 单门为视频监控tab获取列表的接口地址
                    listUrl = 'device/getNewManagementListWithRole.do'
                } else {
                    //视频通信、移动终端接口
                    // listUrl = 'device/getManagementList.do'; //"device/getList.do";
                    listUrl = 'device/getNewManagementList.do'; //"device/getList.do";
                }
                vm.layerLoading = layer.load();
                //如果是设备号码查询，不能含有中文
                var pattern = /^[^\u4e00-\u9fa5]{0,}$/;
                if (this.terminalNum && (!pattern.test(this.terminalNum))) {
                    layer.msg("终端号码不含中文");
                    layer.close(vm.layerLoading);
                    return;
                }
                // 每次请求数据都要清空要删除的id字符串
                this.deleteArray = "";
                this.checkedAll = false; //每次请求数据都将全选关掉
                this.checkedAllLength = 0; //清空勾选数量
                //console.log(this.city_gradeid)
                var screenData = {
                    userId: this.userInfoId,
                    action: listUrl,
                    menuType: this.terminalType, //类型
                    pageNum: this.pageNum, //分页
                    pageSize: this.pageSize,
                    number: this.terminalNum, //设备号码
                    type: this.searchTerType == 0 ? "" : this.searchTerType,//终端设备类型
                    deviceName: this.terminalName, //名字模糊查询
                    equipmentId: this.regionId, //区域ID
                    isCheckLngAndLat: true,
                    /*查询所有设备 是否经纬度为空 */
                    source: vm.source, //数据来源 用于视频监控项中的类型选项 0：代表所有数据  1：紧代表本地数据  2：代表第三方数据
                    gradeid: this.city_gradeid, //行政级别
                    lngAndLatType: vm.lngAndLatType,//验证经纬度
                };
                if (this.indexNum == 8) {
                    //标签管理
                    screenData = {
                        action: listUrl,
                        type: 'GET',
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        labelName: this.searchLableName
                    }
                } else if (this.indexNum == 3) {
                    //电视墙
                    screenData = {
                        action: listUrl,
                        type: 'get',
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        userId: this.userInfoId,
                        tvWallName: this.searchTVWallName
                    }
                } else if (this.indexNum == 9) {
                    //监控预案
                    screenData = {
                        action: listUrl,
                        type: 'post',
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        // userId:this.userInfoId,
                        planName: this.searchPlanName,
                    }
                }
                if (this.indexNum != 5 || this.indexNum != 6 || this.indexNum != 7) {
                    //视频通信、视频监控、移动终端
                    screenData.platformID = vm.platformID;
                }
                this.deleteEmptyString(screenData, true); // 去空项
                if (this.isShowEnterprise && this.terminalType == 5 && this.indexNum == 2) {
                    // alert('自动获取的数据');
                    let jsonData = {
                        "enterprise_id": vm.enterpriseIDSel,//企业ID
                        "page_number": this.pageNum,
                        "page_size": this.pageSize,
                        "user_name_or_phonenum": this.terminalNumOrName,//用户姓名或手机号码
                        // "region_name":'',//行政机构名称
                        "region_code": this.regionId,//行政机构编码
                    };
                    vm.getEnterpriseUserList(jsonData);
                    // $.ajax({
                    //     url: "p_server_api/get_enterprise_user_list.do",
                    //     type: 'post',
                    //     dataType: 'json',
                    //     data: JSON.stringify(jsonData),
                    //     contentType: "application/json;charset=UTF-8",
                    //     success:function(json){
                    //         if(json.result){
                    //             layer.close(vm.layerLoading);
                    //             vm.allpageNum = json.data.page_total_pages;
                    //             vm.allDataNum = json.data.page_total_items;
                    //             // 判断请求的页数是否比得到的总页数大 如果大就按照这个条件将页码归1从新查询
                    //             if (vm.allpageNum > 0 && vm.pageNum > vm.allpageNum) {
                    //                 // 按照这个条件从第一页再查询一次
                    //                 vm.ificationClick(vm.indexNum);
                    //             }
                    //             vm.deviceList = []; //清空数据
                    //             vm.deviceList=json.data.list;
                    //         }else{
                    //             layer.alert("查询掌上通列表失败");
                    //         }
                    //     },
                    //     error:function(){
                    //         layer.close(vm.layerLoading);
                    //         layer.msg("查询掌上通列表失败");
                    //         vm.allpageNum = 0;
                    //         vm.deviceList = []; //清空数据
                    //         return;
                    //     }
                    // });
                } else {
                    // 新增点击监控预案，接口修改请求方式和传参，
                    if (this.indexNum === 9) {
                        let params = {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            planName: this.searchPlanName,
                            planType: '',
                            planTypeLevel: ''
                        }
                        if (JSON.stringify(this.searchInpObj) === '{}') {
                            delete params['planType']
                            delete params['planTypeLevel']
                        } else {
                            params['planType'] = this.searchInpObj.planType === 0 ? [0] : this.searchInpObj.planType
                            params['planTypeLevel'] = this.searchInpObj.planTypeLevel
                        }
                        this.getCheckedList(params)
                    }
                    this.indexNum !== 9 && ajaxdata(screenData, function (result, data) {
                        if (result) {
                            layer.close(vm.layerLoading);
                            //console.log(data
                            vm.allpageNum = data.list.pages;
                            vm.allDataNum = data.list.total;
                            // 判断请求的页数是否比得到的总页数大 如果大就按照这个条件将页码归1从新查询
                            if (vm.allpageNum > 0 && vm.pageNum > vm.allpageNum) {
                                // 按照这个条件从第一页再查询一次
                                vm.ificationClick(vm.indexNum);
                            }
                            vm.userTotal = data.list.total;
                            vm.deviceList = []; //清空数据
                            vm.deviceList = data.list.list;
                            //终端管理添加平台类型字段
                            vm.deviceList.map(function (itm) {
                                if (itm.flag64 == 1) {
                                    itm.flag64 = '64位系统';
                                } else {
                                    itm.flag64 = '16位系统';
                                }
                            });
                            // 赋值设置收藏的设备
                            data.collectList && data.collectList.forEach(function (item, index) {
                                vm.deviceList.find(function (item1) {
                                    if (item.deviceID == item1.deviceID) {
                                        item1.state = item.state;
                                        return true;
                                    }
                                });
                            })
                            // 赋值常用终端的设备
                            data.oftenList && data.oftenList.forEach(function (item, index) {
                                vm.deviceList.find(function (item1) {
                                    if (item.deviceID == item1.deviceID) {
                                        item1.customState = item.state;
                                        return true;
                                    }
                                });
                            })
                            //console.log(vm.deviceList)
                            //console.log('======');
                            //console.log(vm.deviceList);
                            // 用于判断常用终端 先将常用终端的id保存下来  设备号如果想等就设为常用终端
                            if (typeof data.customDeviceList != "undefined") {
                                vm.customDeviceList = []; //清空数据
                                vm.customDeviceList = data.customDeviceList;
                                vm.customDeviceId = []; //清空数据
                                for (var i = 0; i < data.customDeviceList.length; i++) {
                                    var customID = data.customDeviceList[i];
                                    var customUserId = customID.userId;
                                    if (customUserId == vm.userInfoId) {
                                        vm.customDeviceId.push(customID.id);
                                    }
                                }
                            }
                            //批量操作选项为当前页或全部数据时 勾选数据
                            if (vm.batchOperOption == '1') { // 当前页数据
                                if (!vm.checkedAll) {
                                    vm.fnClickAll();
                                }
                            } else if (vm.batchOperOption == '2') { // 全部数据
                                vm.deviceList.forEach(item => {
                                    let deviceID = item.type == 102 ? (item.deviceID ? item.deviceID : item.id) : item.id;
                                    if (!vm.exceptionArray.includes(deviceID)) {
                                        vm.fnClick(item);
                                    }
                                });
                            }
                        } else {
                            layer.close(vm.layerLoading);
                            layer.msg("查询失败");
                            vm.allpageNum = 0;
                            vm.deviceList = []; //清空数据
                            return;
                        }
                    });
                }
            },
            /*
            * 获取企业列表
            * 注：只需要调用接口就行，任何参数都不需要传
            * */
            getEnterpriseList: function () {
                let ajaxUrl = 'p_server_api/get_enterprise_list.do';//从pserver获取企业列表接口
                $.ajax({
                    url: ajaxUrl,
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify({}),
                    contentType: "application/json;charset=UTF-8",
                    success: function (json) {
                        if (json.result == "ok") {
                            if (json.data.length) {
                                vm.enterpriseData = json.data;
                                vm.enterpriseIDSel = json.data[0].id;
                                console.log(vm.enterpriseIDSel);
                            }
                        } else {
                            layer.alert(json.msg);
                            vm.enterpriseData = [];
                            vm.enterpriseIDSel = "";
                        }
                    },
                    error: function (fail) {
                        vm.enterpriseData = [];
                        vm.enterpriseIDSel = "";
                    }
                });
            },
            /*
            * 获取企业掌上通用户列表
            * data  查询条件
            * */
            getEnterpriseUserList: function (data) {
                $.ajax({
                    url: "p_server_api/get_enterprise_user_list.do",
                    type: 'post',
                    dataType: 'json',
                    data: JSON.stringify(data),
                    contentType: "application/json;charset=UTF-8",
                    success: function (json) {
                        if (json.result == "ok") {
                            layer.close(vm.layerLoading);
                            vm.allpageNum = json.data.page_total_pages;
                            vm.allDataNum = json.data.page_total_items;
                            // 判断请求的页数是否比得到的总页数大 如果大就按照这个条件将页码归1从新查询
                            if (vm.allpageNum > 0 && vm.pageNum > vm.allpageNum) {
                                // 按照这个条件从第一页再查询一次
                                vm.ificationClick(vm.indexNum);
                            }
                            vm.deviceList = []; //清空数据
                            vm.deviceList = json.data.list;
                        } else {
                            layer.close(vm.layerLoading);
                            layer.alert("查询掌上通列表失败");
                            vm.allpageNum = 0;
                            vm.deviceList = []; //清空数据
                            return;
                        }
                    },
                    error: function () {
                        layer.close(vm.layerLoading);
                        layer.msg("查询掌上通列表失败");
                        vm.allpageNum = 0;
                        vm.deviceList = []; //清空数据
                        return;
                    }
                });

            },
            // 搜索
            getScreenData: function () {
                this.layerLoading = layer.load();
                this.exceptionArray = [];
                this.ificationClick(this.indexNum);
            },
            //终端设备类型下拉框
            deviceTypeSel: function (event) {
                vm.layerLoading = layer.load(); //点击分页加load
                var _this = event.target;
                vm.searchTerType = $(_this).val();
                vm.pageNum = 1;
                vm.getList();
            },
            //视频监控类型下拉框
            fnMonitorSel: function (event) {
                vm.layerLoading = layer.load(); //点击分页加load
                var _this = event.target;
                vm.source = $(_this).val();
                vm.pageNum = 1;
                vm.getList();
            },
            //经纬度校验下拉框
            lngLatSel: function (event) {
                vm.layerLoading = layer.load(); //点击分页加load
                var _this = event.target;
                vm.lngAndLatType = $(_this).val();
                vm.pageNum = 1;
                vm.getList();
            },
            /*
            * 移动终端 来源下拉框改变事件
            * */
            fnSourceSel: function (event) {
                vm.layerLoading = layer.load(); //加load
                var _this = event.target;
                this.dataSource = $(_this).val();
                this.firstEnter = true;
                this.treeList = [];
                if ($(_this).val() == 'auto') {
                    this.regionNum = null;
                    vm.isShowEnterprise = true;//展示企业下拉框
                    if ($("#userInfoId").attr("data-permission") != 2) {
                        this.regionId = '000000000000';
                    } else {
                        this.regionId = $("#userInfoId").attr("data-regionbId");
                    }
                    vm.getEnterpriseList();//绑定企业数据
                    setTimeout(function () {
                        console.log('enterpriseIDSel', vm.enterpriseIDSel);
                        vm.getTreeData(vm.regionId);
                    }, 200)
                } else {
                    //判断是否为超管，超管无行政区域，默认全国
                    if (this.permission == 0) {
                        this.areaCode = '000000000000';
                        this.regionId = '000000000000';
                    } else {
                        this.areaCode = $("#regionbId").val();
                        this.regionId = $("#regionbId").val();
                    }
                    vm.isShowEnterprise = false;//隐藏企业下拉框
                    this.getTreeData(this.regionId);
                }
                vm.pageNum = 1;
                vm.getList();
            },
            /*
            * 移动终端 企业下拉框改变事件
            *
            * */
            fnEnterpriseSel: function (event) {
                vm.layerLoading = layer.load(); //加load
                var _this = event.target;
                // alert("企业ID"+$(_this).val());
                vm.enterpriseIDSel = $(_this).val();//企业ID
                this.firstEnter = true;
                if ($("#userInfoId").attr("data-permission") != 2) {
                    this.regionId = '000000000000';
                } else {
                    this.regionId = $("#userInfoId").attr("data-regionbId");
                }
                this.getTreeData(this.regionId);
                vm.pageNum = 1;
                vm.getList();
            },
            /**
             * 字段判空处理
             * **/
            changeValue: function (value) {
                var ovalue = (value == null || value == undefined || value == "" || value == "null") ? "" : value;
                return ovalue;
            },
            //收藏夹
            collectionEquipment: function (item) {

                if (item.tglUserId) { //如果这个字段有值 就是同步过来的收藏数据，
                    layer.msg("此数据为第三方数据，您没有取消收藏权限!");
                    return;
                }
                var deviceState, textTitle;
                if (item.state == 1 || item.state == 3) {
                    deviceState = 0; //取消收藏
                    textTitle = "取消收藏";
                } else {
                    deviceState = 3; //收藏
                    textTitle = "收藏";
                }
                var collectionData = {
                    action: "device/settingCollect.do",
                    deviceID: item.deviceID, //设备id
                    state: deviceState, //设备状态
                    userId: vm.userInfoId, //用户id
                    menuType: item.menuType, //设备种类
                    type: item.type, //设备种类的类型 例：启明
                    thirdparty: item.thirdparty //本地或第三方
                }
                //console.log(deviceState)
                ajaxdata(collectionData, function (result, data) {
                    if (result) {
                        // layer.msg(data.msg);
                        vm.layerLoading = layer.load();
                        vm.getList();

                    } else {
                        layer.msg(data.msg);
                    }
                })



            },
            //设置轮询监控
            monitoringPolling: function (item, sign) {
                //console.log(item);
                //console.log(sign);
                var textTitle;
                var pollingData;
                if (sign) {
                    textTitle = "添加到监控轮询列表";
                    pollingData = {
                        action: "device/addRoundRobin.do",
                        number: item.number,
                        deviceID: item.deviceID,
                        thirdparty: item.thirdparty,
                        name: item.name
                    };
                } else {
                    textTitle = "从监控轮询列表中删除";
                    pollingData = {
                        action: "device/deleteRoundRobin.do",
                        number: item.number,
                        deviceID: item.deviceID,
                        thirdparty: item.thirdparty
                    };
                }
                var layerPolling = layer.open({
                    title: '温馨提示',
                    content: '您确定要' + textTitle + '吗?',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        ajaxdata(pollingData, function (result, data) {

                            if (result) {
                                layer.close(layerPolling);
                                layer.msg(data.msg);
                                vm.layerLoading = layer.load();
                                vm.getList();
                            } else {
                                layer.msg(data.msg);
                            }
                        });
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            //设置自动接警终端  isauto为true设置，isauto为false取消设置
            isAutoDevice: function (item, isauto) {
                var textTitle;
                var setData;
                if (isauto) {
                    textTitle = "设为事件自动处理回拨终端";
                    setData = {
                        action: "device/setDeviceAtuo.do",
                        deviceId: item.id,
                        userId: item.userId,
                        isAuto: "1"
                    };
                } else {
                    textTitle = "恢复为常用终端";
                    setData = {
                        action: "device/setDeviceAtuo.do",
                        deviceId: item.id,
                        userId: item.userId,
                        isAuto: "0"
                    };
                }
                var layerIsAuto = layer.open({
                    title: '温馨提示',
                    content: '您确定要' + textTitle + '吗?',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        ajaxdata(setData, function (result, data) {
                            if (result) {
                                layer.close(layerIsAuto);
                                layer.msg(data.msg);
                                vm.layerLoading = layer.load();
                                vm.getList();
                            } else {
                                layer.msg(data.msg);
                            }
                        });
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            //更改当前状态
            upState: function ($event, item) {
                var $this = $event.target;
                var userId = item.userId;
                var deviceId = item.id;
                var deviceState;
                // 匹配视频通讯设备号和常用终端设备号是否相等相等的话把customDeviceList的customState传过去用来取消常用终端
                // if (vm.customDeviceList) {
                //     for (var i = 0; i < vm.customDeviceList.length; i++) {
                //         var customData = vm.customDeviceList[i];
                //         if (deviceId == customData.id) {
                //             deviceState = customData.customState;
                //         }
                //     }
                // }
                // // 如果没找到customState就默认给0
                deviceState = (deviceState == "" || deviceState == null || deviceState == undefined) ? 0 : deviceState;
                if (item.customState == 1 || item.customState == 2) {
                    deviceState = 2;
                }
                var title = '确定' + $($this).attr('title') + '吗？'; //"确定改变设备当前状态吗?";
                var o = layer.open({
                    title: '温馨提示',
                    content: title,
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        layer.close(o);
                        $.ajax({
                            url: 'device/updateState.do',
                            type: 'post',
                            data: {
                                'deviceId': '' + deviceId,
                                'state': deviceState,
                                "userId": vm.userInfoId
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                    layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                        closeBtn: 0
                                    }, function () {
                                        location.reload();
                                    });
                                    return;
                                }
                                layer.msg(data.msg);
                                if (data.result) {
                                    vm.getList();
                                }
                            },
                        });
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            /**
             *智能标注
             */
            biaozhu: function () {
                if ($('#offlineMapState').val() == 1) return layer.msg('离线地图版本暂时不支持此功能');
                if (this.indexNum >= 3) return;
                Intelligent_annotation.getdata();
            },
            //连接websocket
            ws_polic: function () {
                var _this = this;
                var is_WebSocket = window.WebSocket || window.MozWebSocket;
                var new_WebSocket = new is_WebSocket(encodeURI(_this.police_wsUrl));
                //检测连接是否成功
                var timerss = setTimeout(function () {
                    if (new_WebSocket.readyState != 1) {
                        //首次加载即可连接一次，在连接两次连接不成功不进行连接
                        if (_this.polic_count === 3) {
                            layer.alert("一键报警服务连接异常!请刷新尝试");
                            console.log("一键报警服务连接异常!");
                            _this.ispoliceWs = false;
                            if (_this.parcessCountLayer) {
                                layer.close(_this.parcessCountLayer);
                            }
                        } else {
                            _this.ws_polic();
                            _this.polic_count++;
                        }
                    }
                    clearTimeout(timerss);
                }, 2000);

                /*保持心跳保证长连接*/
                var timer = setInterval(function () {
                    if (new_WebSocket.readyState == 1) {
                        var Keepalive = {
                            userName: $("#username").attr("data-name"), //用户名
                            userId: $("#username").val(), //用户id
                            type: $("#username").attr("data-type"), //类型 0,超级管理员,1管理员,2普通用户
                            timer: formatDateTime(new Date()) //当前时间
                        }
                        new_WebSocket.send(JSON.stringify(Keepalive));
                        //console.log(JSON.stringify(Keepalive),"保持心跳");
                    } else {
                        if (_this.polic_count === 3) {
                            if (!_this.islayer) {
                                layer.alert("一键报警服务连接异常!请刷新尝试");
                                console.log("一键报警服务连接异常!");
                                _this.islayer = !_this.islayer;
                                _this.ispoliceWs = false;
                                if (_this.parcessCountLayer) {
                                    layer.close(_this.parcessCountLayer);
                                }
                            }

                        } else {
                            _this.ws_polic();
                            _this.polic_count++;
                        }
                    }

                }, 20000);
                new_WebSocket.onmessage = function (message) {
                    _this.polic_count = 0;//收到消息，清空websocket连接次数
                    var datas = JSON.parse(message.data);
                    if (datas.result == 100) {
                        _this.ispoliceWs = true;
                        console.log("-----------一键报警-链接成功------------------");
                    }
                    if (datas.result == 200 && datas.description.syncMonitor) {
                        var syncMonitor = datas.description.syncMonitor;
                        if (syncMonitor.syncCode == "700") { //同步中
                            if (_this.monitorlayer) {
                                layer.close(_this.monitorlayer);
                            }
                            if (vm.layerLoading) {
                                layer.close(vm.layerLoading);
                            }
                            if (_this.processVue) {
                                _this.processVue.processList = syncMonitor.syncMsg;
                            }
                            _this.processLayer();
                        } else if (syncMonitor.syncCode == "800") { //同步完成
                            if (_this.monitorlayer) {
                                layer.close(_this.monitorlayer);
                            }
                            if (_this.parcessCountLayer) {
                                layer.close(_this.parcessCountLayer);
                            }

                            layer.msg("同步监控资源成功!耗时:" + mSconversion(syncMonitor.syncDuration) + "同步:" + syncMonitor.syncCount + "条", {
                                time: 3000
                            });
                        }
                    }
                }

                function mSconversion (value) {
                    var days;
                    if (value < 1000 * 60 * 60 * 24) {
                        days = 0; //获取日
                    } else {
                        days = parseInt(value / (1000 * 60 * 60 * 24)); //获取日
                    }
                    var hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); //获取小时
                    var minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60)); //获取分钟
                    var seconds = (value % (1000 * 60)) / 1000; //获取秒
                    return (days ? (days + "天  ") : "") + (hours ? (hours + "小时  ") : "") + minutes + "分钟 " + seconds + "秒";
                };
                /**
                 * 获取当前时间
                 */
                function formatDateTime (date) {
                    var y = date.getFullYear(), //年
                        m = date.getMonth() + 1, //月
                        d = date.getDate(), //日
                        h = date.getHours(), //时
                        minute = date.getMinutes(), //分
                        second = date.getSeconds(); //秒
                    /**
                     * 小于10的值补零
                     * @n {Number}
                     * */
                    function repair (n) {
                        return n < 10 ? ('0' + n) : n;
                    }
                    m = repair(m);
                    h = repair(h);
                    d = repair(d);
                    minute = repair(minute);
                    second = repair(second);
                    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                }
            },
            processLayer: function () {
                var _this = this;
                //console.log(_this.processVue.processList)
                var layer_dom = '<div id="processlayer">\
					    <div style="width:60px;height:24px;margin: 0 auto;margin-top: 20px;margin-bottom: 25px;background: url(resource/common/js/layer/layer/skin/default/loading-0.gif) no-repeat"></div>\
					    <div class="layer_count" style="margin-bottom:15px;padding:0 10px; font-size:15px;text-align: center;">{{processList}}</div>\
					</div>';
                layer.open({
                    id: "process",
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    content: layer_dom,
                    area: [280, 120],
                    success: function (layero, index) {
                        $("#process").parent().addClass('znbz-layer');
                        _this.parcessCountLayer = index;
                        _this.processVue = new Vue({
                            el: "#processlayer",
                            data: {
                                processList: '',
                            }
                        });
                    }
                });
            },
            /**
             * 监控数据同步
             * 这个接口耗时很长
             */
            synchronization_data: function () {
                var _this = this;
                //连接一键报警websocket

                if (!_this.ispoliceWs) {
                    _this.ws_polic();
                }
                console.log("监控数据同步");

                var content = "<p class='remove_title'  style='padding:20px; padding-bottom: 0px; margin:0;font-size: 14px;text-align: left;'>同步监控资源会花费几分钟，在此期间请勿关闭浏览器做任何操作避免同步失败！</p>\
								<div class='remove-function clearfix'>\
									<a href='javascript:;' id='remove_ok' class='remove-confirm'>确定</a>\
									<a href='javascript:;' id='remove_no' class='remove-close'>取消</a>\
								</div>";
                var layerRemove = layer.open({
                    id: 'tbsj',
                    type: 1,
                    title: "同步监控资源",
                    content: content,
                    success: function (layero, index) {
                        $("#tbsj").parent().addClass('tbsj-layer');
                        _this.monitorlayer = index;
                        $("#remove_ok").click(function () {
                            var $thisdom = $(this);
                            if ($thisdom.attr("data-lock")) {
                                layer.msg("正在同步中");
                                return;
                            };
                            //设置锁
                            $thisdom.attr("data-lock", "1");
                            $thisdom.html('同步中...');
                            //关闭弹框
                            layer.close(layerRemove);
                            //                            var layer_dom = '<div>\
                            //								    <div style="width:60px;height:24px;margin: 0 auto;margin-top: 20px;margin-bottom: 25px;background: url(resource/common/js/layer/layer/skin/default/loading-0.gif) no-repeat"></div>\
                            //								    <div class="layer_count" style="margin-bottom:15px;padding:0 10px; font-size:15px;text-align: center;">同步中...</div>\
                            //								</div>';
                            //                            var layer_id = layer.open({
                            //                                type: 1,
                            //                                title: false,
                            //                                closeBtn: 0,
                            //                                content: layer_dom,
                            //                                area: [280, 120]
                            //                            });
                            _this.layerLoading = layer.load();
                            //同步数据接口
                            var synchronization_url = {
                                action: 'synchronizationResources/monitor.do',
                            };
                            ajaxdata(synchronization_url, function (result, data) {
                                if (vm.layerLoading) {
                                    layer.close(vm.layerLoading);
                                }
                                if (_this.parcessCountLayer) {
                                    layer.close(_this.parcessCountLayer);
                                }
                                //                                if (result) {
                                //                                    layer.msg("同步监控资源成功!耗时:" + mSconversion(data.time) + "同步:" + data.count + "条");
                                //                                    layer.close(layer_id);
                                //                                    //开启锁
                                //                                    $thisdom.attr("data-lock", "").html('确定');
                                //
                                //                                } else {
                                //                                    layer.msg("同步监控资源失败!原因:" + data.msg);
                                //                                    //开启锁
                                //                                    $thisdom.attr("data-lock", "").html('确定');
                                //                                    layer.close(layer_id);
                                //                                };
                                //                                /**
                                //                                 * --处理耗费时间--
                                //                                 * @value {NNumber} 374002 毫秒数
                                //                                 */
                                //                                function mSconversion(value) {
                                //                                    var days = parseInt(value / (1000 * 60 * 60 * 24));//获取日
                                //                                    var hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));//获取小时
                                //                                    var minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));//获取分钟
                                //                                    var seconds = (value % (1000 * 60)) / 1000;//获取秒
                                //                                    return (days ? (days + "天  ") : "") + (hours ? (hours + "小时  ") : "") + minutes + "分钟 " + seconds + "秒";
                                //                                };
                                if (!result) {
                                    // if (_this.parcessCountLayer) {
                                    //     layer.close(_this.parcessCountLayer);
                                    // }
                                    layer.msg(data.msg);
                                }
                            });

                        });
                        $("#remove_no").click(function () {
                            // 提交所有id
                            layer.close(layerRemove);
                        });
                    },
                });
            },
            /**
             * ****收藏数据同步
             * 这个接口耗时很长
             */
            collection_data: function () {
                console.log("收藏数据同步");

                var content = "<p class='remove_title'>同步收藏夹会花费几分钟，在此期间请勿关闭浏览器做任何操作避免同步失败！</p>\
								<div class='remove-function clearfix'>\
								</div>";
                var layerRemove = layer.open({
                    id: 'tbsj',
                    title: "同步收藏夹",
                    content: content,
                    btn: ['确定', '取消'],
                    success: function () {
                        $("#tbsj").parent().addClass('tbsj-layer');
                        //                        $("#remove_ok").click(function () {
                        //
                        //
                        //                        });
                        //                        $("#remove_no").click(function () {
                        //                            // 提交所有id
                        //                            layer.close(layerRemove);
                        //                        });
                    },
                    yes: function () {
                        var $thisdom = $(this);
                        if ($thisdom.attr("data-lock")) {
                            layer.msg("正在同步中");
                            return;
                        };
                        //设置锁
                        $thisdom.attr("data-lock", "1");
                        $thisdom.html('同步中...');
                        //关闭弹框
                        layer.close(layerRemove);
                        var layer_dom = '<div>\
								    <div style="width:60px;height:24px;margin: 0 auto;margin-top: 20px;margin-bottom: 25px;background: url(resource/common/js/layer/layer/skin/default/loading-0.gif) no-repeat"></div>\
								    <div class="layer_count" style="margin-bottom:15px;padding:0 10px; font-size:15px;text-align: center;">同步中...</div>\
								</div>';
                        var layer_id = layer.open({
                            id: 'tbscj',
                            type: 1,
                            title: false,
                            closeBtn: 0,
                            content: layer_dom,
                            area: [280, 120],
                            success: function () {
                                $("#tbscj").parent().addClass('znbz-layer');
                            }
                        });
                        //同步收藏夹数据接口
                        var synchronization_url = {
                            action: 'bind/synchronizingMonitorCollect.do',
                            userId: $('#userInfoId').val(),
                        };
                        ajaxdata(synchronization_url, function (result, data) {
                            if (result) {
                                //layer.msg("同步监控资源成功!耗时:"+mSconversion(data.time)+"同步:"+data.count+"条");
                                layer.close(layer_id);
                                layer.msg(data.msg);
                                //开启锁
                                $thisdom.attr("data-lock", "").html('确定');

                            } else {
                                layer.msg("同步收藏夹失败!原因:" + data.msg);
                                //开启锁
                                $thisdom.attr("data-lock", "").html('确定');
                                layer.close(layer_id);
                            };
                            /**
                             * --处理耗费时间--
                             * @value {NNumber} 374002 毫秒数
                             */
                            function mSconversion (value) {
                                var days;
                                if (value < 1000 * 60 * 60 * 24) {
                                    days = 0; //获取日
                                } else {
                                    days = parseInt(value / (1000 * 60 * 60 * 24)); //获取日
                                }
                                var hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); //获取小时
                                var minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60)); //获取分钟
                                var seconds = (value % (1000 * 60)) / 1000; //获取秒
                                return (days ? (days + "天  ") : "") + (hours ? (hours + "小时  ") : "") + minutes + "分钟 " + seconds + "秒";
                            };
                        });
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },


            /**
             * 监控数据同步
             * 这个接口耗时很长
             */
            synchronization_network: function () {
                var _this = this;
                console.log("监控数据同步");
                var content = "<p class='remove_title'  style='padding:20px; padding-bottom: 0px; margin:0;font-size: 14px;text-align: left;'>同步网管数据会花费几分钟，在此期间请勿关闭浏览器做任何操作避免同步失败！</p>\
								<div class='remove-function clearfix'>\
									<a href='javascript:;' id='remove_ok' class='remove-confirm'>确定</a>\
									<a href='javascript:;' id='remove_no' class='remove-close'>取消</a>\
								</div>";
                var layerRemove = layer.open({
                    id: 'tbsj',
                    type: 1,
                    title: "同步网管数据",
                    content: content,
                    success: function () {
                        $("#tbsj").parent().addClass('tbsj-layer');
                        $("#remove_ok").click(function () {
                            var $thisdom = $(this);
                            if ($thisdom.attr("data-lock")) {
                                layer.msg("正在同步中");
                                return;
                            };
                            //设置锁
                            $thisdom.attr("data-lock", "1");
                            $thisdom.html('同步中...');
                            //关闭弹框
                            layer.close(layerRemove);
                            var layer_dom = '<div>\
								    <div style="width:60px;height:24px;margin: 0 auto;margin-top: 20px;margin-bottom: 25px;background: url(resource/common/js/layer/layer/skin/default/loading-0.gif) no-repeat"></div>\
								    <div class="layer_count" style="margin-bottom:15px;padding:0 10px; font-size:15px;text-align: center;">同步中...</div>\
								</div>';
                            var layer_id = layer.open({
                                id: 'tbwgsj',
                                type: 1,
                                title: false,
                                closeBtn: 0,
                                content: layer_dom,
                                area: [280, 120],
                                success: function () {
                                    $("#tbwgsj").parent().addClass('znbz-layer');
                                }
                            });
                            //同步数据接口
                            var synchronization_url = {
                                action: 'synchronizationTerminal/synchronizingTerminalAll.do',
                            };
                            ajaxdata(synchronization_url, function (result, data) {
                                if (result) {
                                    layer.msg("同步网管数据成功!耗时: " + mSconversion(data.duration) + "," + data.data, {
                                        time: 3000
                                    });
                                    layer.close(layer_id);
                                    //开启锁
                                    $thisdom.attr("data-lock", "").html('确定');
                                    _this.ificationClick(_this.indexNum);
                                } else {
                                    layer.msg("同步网管数据失败!原因:" + data.msg, {
                                        time: 3000
                                    });
                                    //开启锁
                                    $thisdom.attr("data-lock", "").html('确定');
                                    layer.close(layer_id);
                                };
                                /**
                                 * --处理耗费时间--
                                 * @value {NNumber} 374002 毫秒数
                                 */
                                function mSconversion (value) {
                                    var days;
                                    if (value < 1000 * 60 * 60 * 24) {
                                        days = 0; //获取日
                                    } else {
                                        days = parseInt(value / (1000 * 60 * 60 * 24)); //获取日
                                    }
                                    var hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); //获取小时
                                    var minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60)); //获取分钟
                                    var seconds = Math.round((value % (1000 * 60)) / 1000); //获取秒
                                    return (days ? (days + "天  ") : "") + (hours ? (hours + "小时  ") : "") + minutes + "分钟 " + seconds + "秒";
                                };
                            });

                        });
                        $("#remove_no").click(function () {
                            // 关闭弹层
                            layer.close(layerRemove);
                        });
                    },
                });
            },
            /**
             * 获取自动同步监控状态 0为关闭 1为开始
             *  name 自动同步监控的标识：autoSyncMonitoring
             * configurationValue 开关是否开启  0为关闭  1为开始
             * */
            getMonitoringUpSwitch: function () {
                $.ajax({
                    url: 'configuration/getSuperConfig.do',
                    type: 'get',
                    data: { 'name': 'autoSyncMonitoring' },
                    dataType: 'json',
                    success: function (data) {
                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                closeBtn: 0
                            }, function () {
                                location.reload();
                            });
                            return;
                        }
                        //data.data 1位开启 0位关闭
                        if (parseInt(data.data)) {
                            $('.MonitoringUpSwitch').addClass('active');
                            vm.isMonitoringUpSwitchActive = 1;
                        } else {
                            $('.MonitoringUpSwitch').removeClass('active');
                            vm.isMonitoringUpSwitchActive = 0;
                        }
                    },
                    error: function (data) {
                        layer.msg('获取自动同步监控开关状态失败');

                    },
                });
            },
            //批量导入按钮
            batchImport: function () {
                this.importFlag = true;
                $('#layui-layer-mubu').show()
            },
            //退出批量导入
            exitImport: function () {
                this.importFlag = false;
                this.$refs.upload.clearFiles();
                this.$refs.upload.abort();
                clearInterval(this.timer);
                this.processFlag = false;
                this.percentage = 0;
                this.fileList = [];
                $('#layui-layer-mubu').hide()
            },
            /**
             * 判断文件大小
             * file 当前文件
             */
            beforeAvatarUpload: function (file) {
                const flag = file.size / 1024 / 1024 < 50
                if (!flag) {
                    layer.msg('上传文件大小超过50MB，请重新上传')
                    this.$refs.upload.clearFiles();
                    clearInterval(this.timer);
                    this.processFlag = false;
                    this.percentage = 0;
                    return flag
                }
                $('.el-upload-list__item .el-icon-close').css('display', 'none');
                $('#btnBox a').addClass('disa');
            },
            /**
             * 删除上传文件的钩子
             * file 当前文件
             * fileList 当前文件列表
             */
            beforeRemove: function (file, fileList) {
                this.fileList = fileList;
            },
            /**
             * 选中所上传的文件
             * file 当前文件
             * fileList 当前文件列表
             */
            mychange: function (file, fileList) {
                this.fileList = fileList;
            },
            /**
             * 上传文件成功
             * res 响应数据
             * file 当前上传的文件
             * fileList 上传的文件列表
             */
            submitSuccess (res, file, filelist) {
                !res.result && layer.msg(res.msg);
                if (res.result) {
                    clearInterval(this.timer);
                    this.timer = setInterval(() => {
                        this.percentage += 1;
                        if (this.percentage >= 100) {
                            $('#btnBox a').removeClass('disa');
                            clearInterval(this.timer)
                            this.$refs.upload.clearFiles();
                            this.processFlag = false;
                            this.percentage = 0;
                            this.errorData.errorFlag = true;
                            this.errorData.detail = res.data;
                            if (res.data.errorCount > 0) {
                                this.errorData.errorMsg = `导入成功，已更新数据${res.data.addCount + res.data.updateCount}条，异常数据${res.data.errorCount}条。请下载异常数据表格，修改后请重新提交。`
                                this.errorData.fileName = res.data.excelPath.split('/').reverse()[0];
                            } else {
                                this.errorData.errorMsg = `导入成功，已更新数据${res.data.addCount + res.data.updateCount}条。`
                                this.errorData.fileName = null;
                            }
                            this.importFlag = false;
                        }
                    }, 25)

                } else {
                    $('#btnBox a').removeClass('disa');
                    clearInterval(this.timer);
                    this.$refs.upload.clearFiles();
                    this.processFlag = false;
                    this.percentage = 0;
                }
            },
            //上传文件按钮
            submitUpload: function () {
                if (this.fileList.length) {
                    this.processFlag = true;
                    this.timer = setInterval(() => {
                        if (this.percentage < 30) this.percentage += 1;
                        if (this.percentage >= 30 && this.percentage < 60) this.percentage += 2;
                        if (this.percentage >= 60 && this.percentage < 90) this.percentage += 1;
                    }, 1000)
                    this.$refs.upload.submit();
                    return
                }
                layer.msg('请选择上传的文件')
            },
            /**
             * 下载上传失败的EXCEl表格数据
             * fileName 文件路径
             */
            downExcel: function (fileName) {
                var that = this;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'synchronizationTerminal/downloadExcel.do?fileName=' + fileName, true);
                xhr.responseType = 'blob';
                xhr.onload = function (e) {
                    if (xhr.status === 200) {
                        if (this.response.result == false) {
                            layer.msg(this.response.msg)
                            return
                        }
                        var el = document.createElement('a');
                        el.href = window.URL.createObjectURL(this.response);
                        el.download = that.errorData.fileName;
                        console.log(111)
                        el.click();
                        el = null;
                    }
                };
                xhr.send();
            },
            //关闭提示弹窗
            takeoff: function () {
                this.errorData.errorFlag = false;
                $('#layui-layer-mubu').hide()
                this.classificationClick(0);
            },
            /*
            *是否开启自动同步监控
            * name 自动同步监控的标识：autoSyncMonitoring
            * configurationValue 开关是否开启  0为关闭  1为开始
            * */
            isMonitoringUpSwitch: function (e) {
                // let isActive = e.currentTarget.getAttribute("class").includes("active");
                let centent = '您正在开启监控资源自动同步功能，开启后无需再手动同步监控。';
                let data = { 'name': 'autoSyncMonitoring', 'configurationValue': 1 };
                //获取当前是开还是关 通过isMonitoringUpSwitchActive值来判断，0为关闭 1为打开
                if (vm.isMonitoringUpSwitchActive) {
                    centent = '您正在关闭监控资源自动同步功能，如需更新监控资源，请点击"手动同步"功能或再次开启"自动同步"功能';
                    data = { 'name': 'autoSyncMonitoring', 'configurationValue': 0 };
                }
                layer.open({
                    content: centent,
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        var load = layer.load();
                        $.ajax({
                            url: 'configuration/saveSuperConfig.do',
                            type: 'post',
                            data: data,
                            dataType: 'json',
                            success: function (data) {
                                if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                    layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                        closeBtn: 0
                                    }, function () {
                                        location.reload();
                                    });
                                    return;
                                }
                                // $('.MonitoringUpSwitch').addClass('active');
                                //点击前isMonitoringUpSwitchActive为1，说明是该点击是关闭的，所以成功后isMonitoringUpSwitchActive=0，移除active
                                if (vm.isMonitoringUpSwitchActive) {
                                    vm.isMonitoringUpSwitchActive = 0;
                                    $('.MonitoringUpSwitch').removeClass('active');
                                    layer.msg('已关闭');
                                } else {
                                    vm.isMonitoringUpSwitchActive = 1;
                                    $('.MonitoringUpSwitch').addClass('active');
                                    layer.msg('已开启');
                                }
                                layer.close(index);
                                layer.close(load);
                            },
                            error: function (data) {
                                if (vm.isMonitoringUpSwitchActive) {
                                    layer.msg('关闭失败');
                                } else {
                                    layer.msg('开启失败');
                                }
                                console.log(data);
                            }
                        })
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                })

            },
            /**
             * 首页数据同步
             * 这个接口耗时比较长
             */
            synchronization_index: function () {
                layer.open({
                    content: '<span style="color:red;">请确保已同步网管、监控数据。</span>缓存同步功能耗时较长，同步期间将影响首页部分功能的正常使用，是否继续？',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        var load = layer.load();
                        $.ajax({
                            url: 'device/syncRegionalCount.do',
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                    layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                        closeBtn: 0
                                    }, function () {
                                        location.reload();
                                    });
                                    return;
                                }
                                layer.msg(data.msg);
                                layer.close(index);
                                layer.close(load);
                            },
                            error: function (data) {
                                layer.msg(data);
                                console.log(data);
                            }
                        })
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                })
            },
            /**
             * 同步 同步成员单位
             */
            synchronization_unitData: function () {
                layer.open({
                    content: '您确定要同步成员单位数据吗？',
                    title: '同步成员单位',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        var load = layer.load();
                        $.ajax({
                            url: 'synchronizationTerminal/synchronizingUnitAll.do',
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                    layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                        closeBtn: 0
                                    }, function () {
                                        location.reload();
                                    });
                                    return;
                                }
                                layer.msg(data.msg);
                                layer.close(index);
                                layer.close(load);
                            },
                            error: function (data) {
                                layer.msg(data);
                                console.log(data);
                            }
                        })
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                })
            },
            /**
             * 添加标签
             */
            addLabel: function () {
                var _this = this;
                var obj = {
                    action: 'labelManage/getLabelTreeByPid.do?labelId=0',
                    type: 'get',
                };
                var load = layer.load();
                ajaxdata(obj, function (result, data) {
                    if (result) {
                        creatAddLayer(data.data);
                    } else {
                        layer.msg(data.msg);
                    }
                    layer.close(load);
                });
                function creatAddLayer (labelList) {
                    var content = '<div class="labelAdd newLabel">\
                               <div class="labelTitle">添加标签<a class="labelIcon" href="javascript:;"></a></div>\
                               <div class="labelBox"><span class="labelName">添加级别：</span><select id="addLevel"><option value="1">一级标签</option><option value="2">二级标签</option></select></div>\
                               <div class="labelBox fistLevNameDiv"><span class="labelName"></span><select id="fistLevName"><option value="0">请选择上级标签</option></select><p>该标签下已有设备，不可再添加标签</p></div>\
                               <div class="labelBox"><span class="labelName">标签名称：</span><input autocomplete="off" placeholder="最多15字" id="labelName" type="text" class="labelText" maxlength="15"></div>\
                               <div class="btn">\
                                   <a href="javascript:;" class="edit-confirm" id="edit">保存</a>\
                                   <a href="javascript:;" class="edit-close">取消</a>\
                               </div>\
                           </div>';
                    var str = '';
                    layer.open({
                        content: content,
                        //btn: ['保存', '取消'],
                        title: false,
                        closeBtn: 0,
                        type: 1,
                        // move:'.labelTitle',
                        success: function (layero, index) {
                            labelList.forEach(function (item) {
                                if (item.level == 1) {
                                    // str += '<option  title="' + item.name + '"  value="' + item.labelId + '" data-devicesLength="' + item.devices.length + '">' + item.name + '</option>';
                                    str += '<option  title="' + item.name + '"  value="' + item.labelId + '" >' + item.name + '</option>';
                                }
                            });
                            var devicesLength = 0;
                            $('#fistLevName').append(str);
                            $('#fistLevName').change(function () {
                                // devicesLength = $(this).find("option:selected").attr('data-deviceslength');

                                var _this = this;
                                var obj = {
                                    action: 'labelManage/getLabelTreeByPid.do?labelId=' + $(this).find("option:selected").val(),
                                    type: 'get',
                                };
                                var load = layer.load();
                                ajaxdata(obj, function (result, data) {
                                    if (result) {
                                        // creatAddLayer(data.data);
                                        devicesLength = data.deviceList.length;
                                        if (Number(devicesLength)) {
                                            $('.fistLevNameDiv p').css('visibility', 'inherit');
                                        } else {
                                            $('.fistLevNameDiv p').css('visibility', 'hidden');
                                        }
                                    } else {
                                        layer.msg(data.msg);
                                    }
                                    layer.close(load);
                                });
                            });
                            /*保存*/
                            $('#edit').click(function () {
                                if ($.trim($('.labelText').val()) == '') {
                                    layer.msg('请填写标签名称');
                                    return;
                                }
                                var re = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/gi;
                                var res = re.test($('.labelText').val());
                                if (!res) {
                                    layer.msg('标签名称只能输入中文、英文、数字、下划线');
                                    return;
                                }
                                if ($('#addLevel').val() == 2 && $('#fistLevName').val() == 0) {
                                    layer.msg('请选择上级标签');
                                    return;
                                }
                                if ($('#addLevel').val() == 2 && Number(devicesLength)) {
                                    layer.msg('该标签下已有设备，不可再添加标签');
                                    return;
                                }
                                var load = layer.load();
                                var json = {
                                    labelName: $.trim($('.labelText').val()),
                                    pid: $('#addLevel').val() == 2 ? $('#fistLevName').val() : 0,
                                    level: $('#addLevel').val(),
                                    state: 0,
                                    type: 0,
                                };
                                $.ajax({
                                    url: 'labelManage/createLabel.do',
                                    type: 'POST',
                                    dataType: 'json',
                                    contentType: "application/json;charset=UTF-8",
                                    data: JSON.stringify(json),
                                    success: function (data) {
                                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                                closeBtn: 0
                                            }, function () {
                                                location.reload();
                                            });
                                            return;
                                        }
                                        layer.msg(data.msg);
                                        if (!data.code) {
                                            layer.close(index);
                                            _this.getList();
                                        }
                                        layer.close(load);
                                    },
                                    error: function (data) {
                                        layer.msg(data);
                                        console.log(data);
                                    }
                                })
                            });
                            $('.edit-close').click(function () {
                                layer.close(index);
                            });
                            $('.labelIcon').click(function () {
                                layer.close(index);
                            });
                            $('#addLevel').change(function () {
                                if ($(this).val() == 1) {
                                    $('.fistLevNameDiv').css('display', 'none');
                                } else {
                                    $('.fistLevNameDiv').css('display', 'block');
                                }
                            })
                        }
                    })
                }
            },
            /*
            *  删除单个标签
            * */
            deleteData: function (data, isSingly) {
                if (data == "") {
                    layer.msg("请选择数据");
                    return
                }
                /*if (itemId == "") {
                    layer.msg("请选择数据");
                    return
                }*/

                var _this = this;
                var jsonarray, json;
                var delid = [];
                if (isSingly) {
                    delid[0] = data;
                } else {
                    data = data.substr(0, data.length - 1); //删除最后的逗号
                    delid = data.split(",")
                }
                var jsonstr = "[]";
                jsonarray = eval('(' + jsonstr + ')');
                for (var i = 0; i < delid.length; i++) {
                    json = { labelId: delid[i] }
                    jsonarray.push(json);
                }
                //return;
                var layerRemove = layer.open({
                    title: "确认删除",
                    content: '该标签下还有二级标签或设备资源，您确定要删除吗？',
                    btn: ['确定', '取消'],
                    yes: function (index) {
                        $.ajax({
                            url: 'labelManage/deleteLabel.do',
                            type: 'POST',
                            dataType: 'json',
                            contentType: "application/json;charset=UTF-8",
                            data: JSON.stringify(jsonarray),
                            success: function (data) {
                                if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                    layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                        closeBtn: 0
                                    }, function () {
                                        location.reload();
                                    });
                                    return;
                                }
                                layer.msg(data.msg);
                                layer.close(layerRemove);
                                _this.getList();
                            },
                            error: function (data) {
                                layer.msg(data);
                            }
                        })
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            /*
            *  编辑标签
            * */
            editLabel: function (data, isEdit) {  //isEdit   查看：false     编辑：true
                var _this = this;
                _this.layerSeachData = '';
                _this.layerSearchType = 1;
                _this.labelName = data.labelName;
                _this.labelId = data.labelId;
                _this.LabeldevList = [];
                _this.LabeldevList2 = [];
                this.isEditor = isEdit;
                if (isEdit) {
                    // this.detailsTitle='编辑标签';
                    // this.isEditor=true;
                    _this.editCheckLabel = layer.open({
                        type: 1,
                        title: false,
                        resize: false,
                        closeBtn: 0,
                        content: $('#editLabel'),
                        // area: ['6.04rem', '4.42rem'],
                        success: function (index, o) {
                            if (!isEdit) {
                                $('.labelDetails').addClass('checkLabel');
                                $('.labelName').attr('disabled', 'true');
                            } else {
                                $('.labelDetails').removeClass('checkLabel');
                                $('.labelName').removeAttr('disabled');
                            }
                            //关闭
                            $('#editLabel .labelIcon').click(function () {
                                layer.close(o);
                            });
                            //取消
                            $('#editLabel .edit-close').click(function () {
                                layer.close(o);
                            });

                        }
                    });
                    return;
                }
                this.detailsTitle = '查看标签';
                // this.isEditor=false;
                // $.ajax({
                //     url: 'labelManage/selectLabelDevice.do',
                //     type: 'get',
                //     data: {
                //         'labelId':data.labelId
                //     },
                //     dataType: 'json',
                //     success: function (data) {
                //         if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                //             layer.alert("您的帐号在别处登录，您已被迫下线!", {
                //                 closeBtn: 0
                //             }, function () {
                //                 location.reload();
                //             });
                //             return;
                //         }
                //         if (data.result) {
                //             _this.oldlabelName=data.data.labelManage.labelName
                //             _this.LabeldevList=data.data.deviceList;
                //             _this.LabeldevList2=_this.LabeldevList;
                //             _this.labeldevLength=data.data.deviceList.length;
                //         }
                //     },
                // });
                _this.selectLabelDeviceByPage();
                _this.editCheckLabel = layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    content: $('.labelDetails'),
                    area: ['6.04rem', '4.42rem'],
                    success: function (index, o) {
                        //查看弹框不显示删除操作,标签名称不可以修改
                        if (!isEdit) {
                            $('.labelDetails').addClass('checkLabel');
                            $('.labelName').attr('disabled', 'true');
                        } else {
                            $('.labelDetails').removeClass('checkLabel');
                            $('.labelName').removeAttr('disabled');
                        }

                        //关闭
                        $('.labelDetails .labelIcon').click(function () {
                            layer.close(o);
                        });
                        //取消
                        $('.edit-close').click(function () {
                            layer.close(o);
                        });

                    }
                });
            },
            /**
             * 函数节流
             * @fn {Function} 回调函数
             * @timer {Number} 时间
             */
            throttle: function (fn, timer) {
                if (this.throttleId) clearTimeout(this.throttleId);
                this.throttleId = setTimeout(function () {
                    fn();
                }, timer || 200);
            },
            selectLabelDeviceByPage: function (_isScoll) {
                var _this = this;
                this.throttle(function () {
                    vm.layerLoading = layer.load();
                    //如果不是滚动加载，则加载第一页
                    if (_isScoll !== 1) {
                        _this.labelDevPage = 1; //页码
                        _this.LabeldevList = [];//标签管理弹框终端数据
                        _this.LabeldevList2 = [];
                    } else {
                        _this.labelDevPage++;
                    }
                    $.ajax({
                        url: 'labelManage/selectLabelDeviceByPage.do',
                        type: 'get',
                        data: {
                            'labelId': _this.labelId,
                            'pageNum': _this.labelDevPage,
                            'pageSize': 10,
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                    closeBtn: 0
                                }, function () {
                                    location.reload();
                                });
                                return;
                            }
                            if (data.result) {
                                _this.oldlabelName = data.data.labelManage.labelName
                                _this.LabeldevList = data.data.deviceList;
                                // _this.LabeldevList2=_this.LabeldevList;
                                // _this.labeldevLength=data.data.deviceList.length;
                                _this.labelDevLastPage = data.data.pageInfo.pages;
                                _this.LabeldevList2 = _this.LabeldevList2.concat(_this.LabeldevList);
                                _this.labeldevLength = _this.LabeldevList2.length;
                            }
                            layer.close(vm.layerLoading);
                        },
                    });
                }, 100)
            },
            //滚动加载
            pullDownLoading: function (obj) {
                var sum_sh = obj.target.scrollHeight; //滚动条高度
                var sum_ch = obj.target.clientHeight; //div可视区域高度
                var sum_st = obj.target.scrollTop; //滚动上
                var scrollBottom = sum_sh - sum_st - sum_ch; //滚动下
                // 每请求一次加一页
                if (scrollBottom < 50) {
                    //如果搜索超出页码，则退出
                    if (this.labelDevLastPage < this.labelDevPage) {
                        return;
                    }
                    this.selectLabelDeviceByPage(1);
                }
            },
            /*
            * 编辑标签删除标签关联的终端
            * */
            delLabelDevice: function (data, index) {
                this.LabeldevList2.splice(index, 1);
                return;
                var _this = this;
                var layerRemove = layer.open({
                    title: "确认删除",
                    content: '您确定要删除该终端吗？',
                    btn: ['确定', '取消'],
                    yes: function (o) {

                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            /*
            * 保存修改后标签名称和关联终端
            * */
            setLabelDev: function () {
                var _this = this;
                if (_this.labeldevLength == this.LabeldevList.length && this.oldlabelName == this.labelName) {
                    layer.close(_this.editCheckLabel);
                    return;
                }
                var saveData = { "labelManages": [], "devices": [] };
                saveData.labelManages[0] = { labelId: this.labelId, labelName: this.labelName };
                for (var i = 0; i < this.LabeldevList.length; i++) {
                    if (this.LabeldevList[i].type == '102') {
                        saveData.devices[i] = { deviceID: this.LabeldevList[i].deviceID };
                    } else {
                        saveData.devices[i] = { deviceID: this.LabeldevList[i].id };
                    }

                }
                if ($.trim(this.labelName) == '') {
                    layer.msg('标签名称不能为空');
                    return;
                }
                var re = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/gi;
                var res = re.test(this.labelName);
                if (!res) {
                    layer.msg('标签名称只能输入中文、英文、数字、下划线');
                    return;
                }
                $.ajax({
                    url: 'labelManage/updateLabelDevice.do',
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(saveData),
                    success: function (data) {
                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                closeBtn: 0
                            }, function () {
                                location.reload();
                            });
                            return;
                        }
                        layer.msg(data.msg);
                        if (data.result) {
                            //关闭弹框
                            layer.close(_this.editCheckLabel);
                            _this.getList();
                        }
                    },
                    error: function (data) {
                        layer.msg(data.msg);
                    }
                })
            },
            /*
            * 获取所有标签
            * */
            getAllLayer: function (labelData) {
                var _this = this;
                var load = layer.load();
                $.ajax({
                    url: 'labelManage/getLabelTreeByPid.do?labelId=0',
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                closeBtn: 0
                            }, function () {
                                location.reload();
                            });
                            return;
                        }
                        if (data.result) {
                            _this.relatednessLabel = data.data;
                            _this.firstLabel.splice(0, _this.firstLabel.length);
                            _this.relatednessLabel2.splice(0, _this.relatednessLabel2.length);
                            data.data.forEach(function (item) {
                                if (item.level == 1) {
                                    _this.firstLabel.push(item);
                                    _this.firstLabel2.push(item);
                                }
                            });
                            var deviceId = '';
                            if (labelData.type == '102') {
                                deviceId = labelData.deviceID;
                            } else {
                                deviceId = labelData.id;
                            }
                            $.ajax({
                                url: 'labelManage/getDeviceLabelList.do',
                                type: 'get',
                                data: {
                                    'deviceId': deviceId
                                },
                                dataType: 'json',
                                success: function (data) {
                                    layer.close(load);
                                    if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                        layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                            closeBtn: 0
                                        }, function () {
                                            location.reload();
                                        });
                                        return;
                                    }
                                    if (data.result) {
                                        _this.deviceLabel = data.list;
                                        _this.deviceLabelall = JSON.parse(JSON.stringify(data.list));
                                        for (var i = 0; i < _this.relatednessLabel2.length; i++) {
                                            for (var j = 0; j < _this.deviceLabel.length; j++) {
                                                if (_this.relatednessLabel2[i].labelId == _this.deviceLabel[j].labelId) {
                                                    _this.$set(_this.relatednessLabel2[i], 'checked', true);
                                                }
                                            }

                                        }
                                    }
                                },
                            });
                        }
                    },
                });
            },
            /*
            *  终端关联标签
            * */
            setRelatedness: function (data) {
                var _this = this;
                _this.deviceLabel = [];
                _this.selectDev = data;
                _this.getAllLayer(data);
                this.relatednessLayer = layer.open({
                    type: 1,
                    zIndex: 5,
                    title: false,
                    closeBtn: 0,
                    content: $('.relatednessLayer'),
                    area: ['6.04rem', '4.54rem'],
                    success: function (index, o) {
                        _this.checkedLabelAll = false;
                        //关闭
                        $('.labelIcon').click(function () {
                            layer.close(o);
                            _this.checkedLabelLength = 0;
                            _this.clearData();
                        });
                        //取消
                        $('.edit-close').click(function () {
                            layer.close(o);
                        });

                    }
                });
            },
            getAllLabelOne: function () {
                this.firstLabelFlag = !this.firstLabelFlag;
            },
            /*
            *  关联标签搜索查看标签
            * */
            getAllLabel: function () {
                var _this = this;
                _this.relatedIsSdarch = !_this.relatedIsSdarch;
                return;
                if (_this.relatedIsSdarch) {
                    _this.searchLabel();
                }
            },
            /*
            * 关联标签搜索清空数据
            * */
            clearData: function () {
                var _this = this;
                _this.relatednessSearch = '';
                _this.relatednessSearchOne = '';
                _this.firstLabel2 = [];
                _this.firstLabel = [];
                _this.relatednessLabel = [];
                _this.relatednessLabel2 = [];
                _this.firstLabelFlag = false;
                _this.relatedIsSdarch = false;
                _this.devicesFlag = false;
            },
            /*
            * 关联标签第一级搜索按钮
            * */
            searchLabelOne: function () {
                var _this = this;
                if (_this.firstLabel.length > 0) {
                    _this.firstLabelFlag = true;
                    var searchString = _this.relatednessSearchOne.trim();
                    _this.firstLabel2 = _this.firstLabel.filter(function (item1) {
                        if (item1.labelName.indexOf(searchString) !== -1) {
                            return true;
                        }
                    });
                } else {
                    _this.firstLabel2 = _this.firstLabel;
                }
            },
            /*
            * 关联标签第一级搜索回车事件
            * */
            searchLabelKeyOne: function (ev) {
                if (ev.keyCode == 13) {
                    this.searchLabelOne();
                }
            },
            /*
            * 关联标签搜索按钮
            * */
            searchLabel: function () {
                var _this = this;
                if (_this.relatednessSearch.length > 0) {
                    _this.relatedIsSdarch = true;
                    var searchString = _this.relatednessSearch.trim();
                    _this.relatednessLabel2 = _this.relatednessLabel.filter(function (item) {
                        if (item.labelName.indexOf(searchString) !== -1) {
                            return item;
                        }
                    })

                } else {
                    _this.relatednessLabel2 = _this.relatednessLabel;
                }
            },
            /*
            * 关联标签搜索回车事件
            * */
            searchLabelKey: function (ev) {
                if (ev.keyCode == 13) {
                    this.searchLabel();
                }
            },
            /*
            * 一级标签选择
            * */
            addFirstLabel: function (o) {
                var _this = this;
                _this.firstLabelFlag = false;
                _this.relatednessSearchOne = o.name;
                // _this.relatednessLabel2.splice(0, _this.relatednessLabel2.length);
                _this.relatednessLabel2 = [];
                _this.relatednessLabel = [];
                $.ajax({
                    url: 'labelManage/getLabelTreeByPid.do?labelId=' + o.labelId,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                closeBtn: 0
                            }, function () {
                                location.reload();
                            });
                            return;
                        }
                        if (data.result) {
                            if (data.data.length) {
                                _this.relatednessLabel2 = data.data;
                                _this.relatednessLabel = data.data;
                            }
                            // 如果一级标签下有二级标签，则显示二级标签的选择框
                            _this.devicesFlag = data.data.length;
                            //
                            _this.deviceLabel.forEach(function (item) {
                                _this.relatednessLabel2.find(function (item1) {
                                    if (item1.labelId == item.labelId) {
                                        item1.checked = true;
                                        return true
                                    }
                                })
                            });
                            // 如果字段不存在
                            if (typeof o.checked == 'undefined') {
                                _this.$set(o, 'checked', true);
                                if (!data.data.length) {
                                    var index = _this.deviceLabel.findIndex(function (item) {
                                        return item.labelId == o.labelId;
                                    });
                                    if (index == -1) {
                                        if (CheckLabelDeviceCount() === false) {
                                            _this.$set(o, 'checked', false);
                                            return;
                                        }
                                        addData();
                                    }
                                }
                            } else {
                                o.checked = !o.checked;
                                if (o.checked == true) {
                                    if (!data.data.length) {
                                        var index = _this.deviceLabel.findIndex(function (item) {
                                            return item.labelId == o.labelId;
                                        });
                                        if (index == -1) {
                                            if (CheckLabelDeviceCount() === false) {
                                                o.checked = !o.checked;
                                                return;
                                            }
                                            addData();
                                        }
                                    }
                                } else {
                                    delData();
                                }
                            }
                            function addData () {
                                for (var i = 0; i < _this.firstLabel.length; i++) {
                                    if (o.labelId == _this.firstLabel[i].labelId) {
                                        _this.deviceLabel.push(_this.firstLabel[i]);
                                        _this.checkedLabelAll = false;//全选按钮取消全选
                                    }
                                }
                            }
                            function delData () {
                                for (var i = 0; i < _this.deviceLabel.length; i++) {
                                    if (_this.deviceLabel[i].labelId === o.labelId) {
                                        _this.deviceLabel.splice(i, 1);
                                    }
                                }
                            }
                            // 检验某标签下同类终端数量
                            function CheckLabelDeviceCount () {
                                var params = {
                                    menuType: vm.terminalType,
                                    labelId: o.labelId,
                                    action: `labelManage/checkLabelDeviceCount.do`,
                                };
                                ajaxdata(params, function (result, data) {
                                    if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                        layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                            closeBtn: 0
                                        }, function () {
                                            location.reload();
                                        });
                                        return;
                                    }
                                    if (result) {
                                        return true;
                                    } else {
                                        console.log(msg);
                                        layer.msg(msg);
                                        return false;
                                    }
                                });
                                // var json= {
                                //     menuType:vm.terminalType,
                                //     labelId: o.labelId,
                                // }
                                // $.ajax({
                                //     url: `labelManage/checkLabelDeviceCount.do`,
                                //     type: 'POST',
                                //     dataType: 'json',
                                //     contentType: "application/json;charset=UTF-8",
                                //     data:JSON.stringify(json),
                                //     success: function (data) {
                                //         if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                                //             layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                //                 closeBtn: 0
                                //             }, function () {
                                //                 location.reload();
                                //             });
                                //             return;
                                //         }
                                //         if (data.result) {
                                //             return true;
                                //         }else{
                                //             layer.msg(data.msg);
                                //             return false;
                                //         }
                                //     },
                                //     error: function (data) {
                                //         layer.msg('检验标签下同类终端数量失败');
                                //         return false;
                                //     }
                                // });
                            }
                        }
                    },
                });
            },
            /*
            * 终端选择标签关联标签
            * */
            addDeviceLabel: function (o) {
                console.log(o)
                var _this = this;
                // 如果字段不存在
                if (typeof o.checked == 'undefined') {
                    if (CheckLabelDeviceCount() === false) {
                        return;
                    }
                    this.$set(o, 'checked', true);
                    addData();
                } else {
                    if (o.checked == false) {
                        if (CheckLabelDeviceCount() === false) {
                            return;
                        }
                        o.checked = !o.checked;
                        addData();
                    } else {
                        o.checked = !o.checked;
                        delData();
                    }
                }
                function addData () {
                    for (var i = 0; i < _this.relatednessLabel2.length; i++) {
                        if (o.labelId == _this.relatednessLabel2[i].labelId) {
                            _this.deviceLabel.push(_this.relatednessLabel2[i]);
                            _this.checkedLabelAll = false;//全选按钮取消全选
                        }
                    }
                }
                function delData () {
                    for (var i = 0; i < _this.deviceLabel.length; i++) {
                        if (_this.deviceLabel[i].labelId === o.labelId) {
                            _this.deviceLabel.splice(i, 1);
                        }
                    }
                }
                // 检验某标签下同类终端数量
                function CheckLabelDeviceCount () {
                    var params = {
                        menuType: vm.terminalType,
                        labelId: o.labelId,
                        action: `labelManage/checkLabelDeviceCount.do`,
                    };
                    ajaxdata(params, function (result, data) {
                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                closeBtn: 0
                            }, function () {
                                location.reload();
                            });
                            return;
                        }
                        if (result) {
                            return true;
                        } else {
                            console.log(msg);
                            layer.msg(msg);
                            return false;
                        }
                    });
                    // var json= {
                    //     menuType:vm.terminalType,
                    //     labelId: o.labelId,

                    // }
                    // $.ajax({
                    //     url: `labelManage/checkLabelDeviceCount.do`,
                    //     type: 'POST',
                    //     dataType: 'json',
                    //     contentType: "application/json;charset=UTF-8",
                    //     data:JSON.stringify(json),
                    //     success: function (data) {
                    //         if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                    //             layer.alert("您的帐号在别处登录，您已被迫下线!", {
                    //                 closeBtn: 0
                    //             }, function () {
                    //                 location.reload();
                    //             });
                    //             return;
                    //         }
                    //         if (data.result) {
                    //             return true;
                    //         }else{
                    //             layer.msg(data.msg);
                    //             return false;
                    //         }
                    //     },
                    //     error: function (data) {
                    //         layer.msg('检验标签下同类终端数量失败');
                    //         return false;
                    //     }
                    // });
                }
            },
            /*
            * 解除标签
            * */
            disengageLabel: function () {
                var _this = this;
                var result = [];
                for (var i = 0; i < _this.deviceLabel.length; i++) {
                    if (_this.deviceLabel[i].checked2 != true) {
                        result.push(_this.deviceLabel[i]);
                    } else {
                        _this.checkedLabelLength--;
                        for (var j = 0; j < _this.relatednessLabel2.length; j++) {
                            if (_this.deviceLabel[i].labelId == _this.relatednessLabel2[j].labelId) {
                                _this.relatednessLabel2[j].checked = false;
                                if (_this.relatednessLabel2[j].checked2) {
                                    delete _this.relatednessLabel2[j].checked2;
                                }
                            }
                        }
                    }
                }
                _this.deviceLabel = result;

                if ((_this.deviceLabel.length == 0 && _this.checkedLabelLength == 0)) {
                    _this.checkedLabelAll = false;
                }
            },
            /*
            * 关联标签多选
            * */
            labelClickAll: function () {
                var _this = this;
                _this.checkedLabelAll = !_this.checkedLabelAll;
                if (this.checkedLabelAll) { //true全选
                    // 遍历数据列表 给数据加一个临时字段用来控制选中状态
                    this.deviceLabel.forEach(function (item, index) {
                        // 如果没有这个字段 就加上
                        if (typeof item.checked2 == 'undefined') {
                            _this.$set(item, 'checked2', _this.checkedLabelAll);

                        } else {
                            item.checked2 = true;
                        }
                    });
                    this.checkedLabelLength = this.deviceLabel.length;
                } else { //true全选
                    this.deviceLabel.forEach(function (item, index) {
                        if (typeof item.checked2 == 'undefined') {
                            _this.$set(item, 'checked2', _this.checkedAll);
                        } else {
                            item.checked2 = false;
                        }
                    });
                    this.checkedLabelLength = 0;
                }
            },
            /*
            * 关联标签单选
            * */
            labelClick: function (o) {
                // 如果字段不存在
                if (typeof o.checked2 == 'undefined') {
                    this.$set(o, 'checked2', true);
                    this.checkedLabelLength++; //单选后勾选数量加1
                } else {
                    o.checked2 = !o.checked2;
                    if (o.checked2 == true) {
                        this.checkedLabelLength++; //单选后勾选数量加1
                    } else {
                        this.checkedLabelLength--; //取消后勾选数量减1
                        // console.log(this.checkedAllLength)
                    }
                }
                if (this.checkedLabelLength == this.deviceLabel.length) { //如果勾选数量等于当前页数据量
                    this.checkedLabelAll = true; //全选按钮打开
                } else {
                    this.checkedLabelAll = false;
                }
            },
            //====================================新增两个方法==============================

            //解除标签多选（2022-4-8:YUEX-新增,没在原始方法进行修改，不确定原始方法到底绑定在哪些地方）
            DeleteLabellabelClickAll: function () {
                var _this = this;
                _this.checkedLabelAll = !_this.checkedLabelAll;
                if (this.checkedLabelAll) { //true全选
                    // 遍历数据列表 给数据加一个临时字段用来控制选中状态
                    console.log(this.LabeldevList2)
                    this.LabeldevList2.forEach(function (item, index) {
                        // 如果没有这个字段 就加上
                        if (typeof item.checked == 'undefined') {
                            _this.$set(item, 'checked', _this.checkedLabelAll);
                        } else {
                            item.checked = true;
                        }
                    });
                    this.checkedLabelLength = this.checkedLabelAll.length;
                } else { //true全选
                    this.LabeldevList2.forEach(function (item, index) {
                        if (typeof item.checked == 'undefined') {
                            _this.$set(item, 'checked', _this.checkedAll);
                        } else {
                            item.checked = false;
                        }
                    });
                    this.checkedLabelLength = 0;
                }
            },
            /*
            * 解除标签单选(2022-4-8:YUEX-新增,没在原始方法进行修改，不确定原始方法到底绑定在哪些地方)
            * */
            DeleteLabellabelClick: function (o) {
                // 如果字段不存在
                if (typeof o.checked == 'undefined') {
                    this.$set(o, 'checked', true);
                    this.checkedLabelLength++; //单选后勾选数量加1
                } else {
                    o.checked = !o.checked;
                    if (o.checked == true) {
                        this.checkedLabelLength++; //单选后勾选数量加1
                    } else {
                        this.checkedLabelLength--; //取消后勾选数量减1
                        // console.log(this.checkedAllLength)
                    }
                }
                if (this.checkedLabelLength == this.LabeldevList2.length) { //如果勾选数量等于当前页数据量
                    this.checkedLabelAll = true; //全选按钮打开
                } else {
                    this.checkedLabelAll = false;
                }
            },
            //解除标签函数(2022-4-8:YUEX-新增)
            removeLabel (dataArrOrItem) {
                var layerRemove = layer.open({
                    title: "解除标签",
                    content: '您确定将选中设备从该标签中解除？',
                    btn: ['确定', '取消'],
                    yes: function (o) {
                        let params = [];
                        if (Array.isArray(dataArrOrItem) === true) {
                            dataArrOrItem.forEach(c => {
                                if (c.checked) {
                                    params.push({
                                        labelId: c.pid,
                                        deviceId: c.deviceID,
                                    })
                                }
                            })
                        } else {
                            params.push({
                                labelId: dataArrOrItem.pid,
                                deviceId: dataArrOrItem.deviceID,
                            })

                        }
                        ajaxdata2(params, 'labelManage/deleteLabelDevices.do', 'POST', (res) => {
                            console.log(res)
                            if (res) {
                                // layer.msg("删除成功");
                                layer.close(layerRemove);
                                vm.selectLabelDeviceByPage()
                            } else {
                                layer.msg("解除失败,请选择后进行解除");
                            }

                        })
                        // LabeldevList2.forEach(c => {
                        //     if(c.checked){
                        //         console.log(c)
                        //     }
                        // })
                        // console.log(vm.LabeldevList)
                        // vm.LabeldevList.splice(index,1)
                        // console.log(vm.LabeldevList)
                        // var content;
                        // $('.labelList').html('');
                        // for(var i=0;i<vm.LabeldevList.length;i++){
                        //     content=' <div class="list-data">\
                        //                         <dl class="displayflex data-dl">\
                        //                             <dd class="dd-tit sel-all">'+(i+1)+'</dd>\
                        //                             <dd class="dd-tit">'+vm.LabeldevList[i].number+'</dd>\
                        //                             <dd class="dd-tit">'+vm.LabeldevList[i].name+'</dd>\
                        //                             <dd class="dd-tit">'+vm.LabeldevList[i].type+'</dd>\
                        //                             <dd class="dd-tit operation">\
                        //                                 <i title="删除" class="del" onclick="delLabelDevice(' + JSON.stringify(vm.LabeldevList[i]).replace(/\"/g, "'") + ','+i+')"></i>\
                        //                             </dd>\
                        //                         </dl>\
                        //                 </div>';
                        //     $('.labelList').append(content);
                        // }
                        /*var callPoliceDelete = {
                            Ids: itemId,
                            action: 'device/remove.do',
                        };
                        // 提交所有id
                        ajaxdata(callPoliceDelete, function (result, data) {
                            if (result) {
                                layer.msg("删除成功");
                                vm.deleteArray = "";
                                vm.getList();
                                layer.close(layerRemove);
                            } else {
                                layer.msg("删除失败");
                            }
                        });*/
                    },
                    btn2: function (layerid, layero) {
                        layer.close(layerid);
                    }
                });
            },
            // ===================================END===============================
            /*
            * 终端绑定标签
            * */
            devBindingslabel: function () {
                var _this = this;
                _this.checkedLabelLength = 0;
                console.log('33', this.deviceLabel, this.deviceLabelall, this.deviceLabel.toString(), this.deviceLabelall.toString());
                // if(this.deviceLabel.toString() === this.deviceLabelall.toString()){
                //     //关闭弹框
                //     // layer.close(_this.relatednessLayer);
                //     layer.msg('请选择关联标签');
                //     return;
                // }
                var saveData = { "labelManages": [], "devices": [] };
                if (this.selectDev.type == '102') {
                    saveData.devices[0] = { deviceID: this.selectDev.deviceID };
                } else {
                    saveData.devices[0] = { deviceID: this.selectDev.id };
                }
                for (var i = 0; i < this.deviceLabel.length; i++) {
                    saveData.labelManages[i] = { labelId: this.deviceLabel[i].labelId };
                }
                var loadDev = layer.load();
                $.ajax({
                    url: `labelManage/createLabelDevice.do?menuType=${vm.terminalType}`,
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(saveData),
                    success: function (data) {
                        layer.close(loadDev);
                        if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                            layer.alert("您的帐号在别处登录，您已被迫下线!", {
                                closeBtn: 0
                            }, function () {
                                location.reload();
                            });
                            return;
                        }
                        layer.msg(data.msg);
                        if (data.result) {
                            //关闭弹框
                            layer.close(_this.relatednessLayer);
                        }
                        _this.clearData();
                    },
                    error: function (data) {
                        layer.msg(data.msg);
                    }
                })

            },
            /*
            * 标签弹框切换搜索类型
            * */
            labelDevSel: function () {
                this.layerSeachData = '';
            },
            /*
            * 标签管理弹框搜索关联终端
            * */
            labelInputFunc: function () {
                var _this = this;
                if (this.layerSearchType == 1) {
                    if (_this.layerSeachData.length > 0) {
                        var searchString = _this.layerSeachData.trim();
                        _this.LabeldevList2 = _this.LabeldevList.filter(function (item) {
                            if (item.name.indexOf(searchString) !== -1) {
                                return item;
                            }
                        })
                    } else {
                        _this.LabeldevList2 = _this.LabeldevList;
                    }
                } else if (this.layerSearchType == 2) {
                    if (_this.layerSeachData.length > 0) {
                        var searchString = _this.layerSeachData.trim();
                        _this.LabeldevList2 = _this.LabeldevList.filter(function (item) {
                            if (item.number.indexOf(searchString) !== -1) {
                                return item;
                            }
                        })
                    } else {
                        _this.LabeldevList2 = _this.LabeldevList;
                    }
                }

            }
        }
    });
    //2017-11-8 张昊 type
    /**用户类型转换**/
    Vue.filter('devicetype-filter', function (value) {
        var text;
        if (!value) {
            return "";
        }
        vm.allType.forEach(function (val) {  // 根据类型号码查询中文名称
            if (val.deviceTypeId === value) text = val.deviceTypeName;
        })
        return text;
        // switch (value) {
        //     case 14:
        //         text = "虚拟终端";
        //     break;
        //     case 4:
        //         text = "极光";
        //         break;
        //     case 5:
        //         text = "启明";
        //         break;
        //     case 6:
        //         text = "启明2";
        //         break;
        //     case 13:
        //         text = "启明3";
        //         break;
        //     case 102:
        //         text = "监控";
        //         break;
        //     case 103:
        //         text = "PCTV";
        //         break;
        //     case 200:
        //         text = "掌上通";
        //         break;
        //     case 202:
        //         text = "安卓盒子";
        //         break;
        //     case 201:
        //         text = "4核极光";
        //         break;
        //     case 'monitor':
        //         text = '导入';
        //         break;
        //     case 'local':
        //         text = '本地';
        //         break;
        // };
        // return text;
    });

    /**设备当前状态**/
    Vue.filter('deviceState-filter', function (value) {
        var text;
        if (!value) {
            text = "";
        }
        switch (value) {
            case -1:
                text = "禁用";
                break;
            case 0:
                text = "正常";
                break;
            case 1:
                text = "在线";
                break;
            case 2:
                text = "常用";
                break;
            case 3:
                text = "收藏";
                break;
        };
        return text;
    });
    /**监控类型**/
    Vue.filter('devicelocaltype-filter', function (value) {
        var text;
        if (!value) {
            return "";
        }
        switch (value) {
            case 'monitor':
                text = '导入';
                break;
            case 'local':
                text = '本地';
                break;
        };
        return text;
    });
    /**设备当前状态**/
    Vue.filter('deviceLatLnt-filter', function (value) {
        var text;
        if (!value) {
            text = "";
        }
        switch (value) {
            case 1:
                text = "正常";
                break;
            case 2:
                text = "异常";
                break;
        };
        return text;
    });
    $(".terminalManagement").addClass("active");



});
/*
*  点击关联标签搜索下拉列表以外的地方隐藏下拉列表
* */
$(document).click(tap);
// 获取当前时间
function today () {
    var today = new Date();
    var h = today.getFullYear();
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    hh = hh < 10 ? "0" + hh : hh;
    mm = mm < 10 ? "0" + mm : mm;
    ss = ss < 10 ? "0" + ss : ss;
    return h + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
}
function tap (ev) {
    var btn = document.querySelector(".search");
    if (!btn.contains(ev.target)) {            //按钮.app-download以外的区域
        vm.relatedIsSdarch = false;
    }
}
/*
*  标签管理弹框删除终端
* */
function delLabelDevice (data, index) {
    console.log(data)
    console.log(index)
    var _this = this;
    var layerRemove = layer.open({
        title: "确认删除",
        content: '您确定要删除该终端吗？',
        btn: ['确定', '取消'],
        yes: function (o) {
            console.log(vm.LabeldevList)
            vm.LabeldevList.splice(index, 1)
            console.log(vm.LabeldevList)
            var content;
            $('.labelList').html('');
            for (var i = 0; i < vm.LabeldevList.length; i++) {
                content = ' <div class="list-data">\
                                                <dl class="displayflex data-dl">\
                                                    <dd class="dd-tit sel-all">'+ (i + 1) + '</dd>\
                                                    <dd class="dd-tit">'+ vm.LabeldevList[i].number + '</dd>\
                                                    <dd class="dd-tit">'+ vm.LabeldevList[i].name + '</dd>\
                                                    <dd class="dd-tit">'+ vm.LabeldevList[i].type + '</dd>\
                                                    <dd class="dd-tit operation">\
                                                        <i title="删除" class="del" onclick="delLabelDevice(' + JSON.stringify(vm.LabeldevList[i]).replace(/\"/g, "'") + ',' + i + ')"></i>\
                                                    </dd>\
                                                </dl>\
                                        </div>';
                $('.labelList').append(content);
            }
            /*var callPoliceDelete = {
                Ids: itemId,
                action: 'device/remove.do',
            };
            // 提交所有id
            ajaxdata(callPoliceDelete, function (result, data) {
                if (result) {
                    layer.msg("删除成功");
                    vm.deleteArray = "";
                    vm.getList();
                    layer.close(layerRemove);
                } else {
                    layer.msg("删除失败");
                }
            });*/
        },
        btn2: function (layerid, layero) {
            layer.close(layerid);
        }
    });
}
/**
 * select 级联切换
 * **/
function gradeChange (obj) {
    var text = "请选择";
    var objVal = $(obj).val();
    var gradeid = $(obj).attr("data-gradeid"); //要操作的是第几级
    if (gradeid == "1") {
        $(".sel2").html("");
        $(".sel2").append('<option data-id="">请选择</option>');
        $(".sel3").html("");
        $(".sel3").append('<option data-id="">请选择</option>');
        $(".sel4").html("");
        $(".sel4").append('<option data-id="">请选择</option>');
        $(".sel5").html("");
        $(".sel5").append('<option data-id="">请选择</option>');
    } else if (gradeid == "2") {
        $(".sel3").html("");
        $(".sel3").append('<option data-id="">请选择</option>');
        $(".sel4").html("");
        $(".sel4").append('<option data-id="">请选择</option>');
        $(".sel5").html("");
        $(".sel5").append('<option data-id="">请选择</option>');
    } else if (gradeid == "3") {
        $(".sel4").html("");
        $(".sel4").append('<option data-id="">无</option>');
        $(".sel5").html("");
        $(".sel5").append('<option data-id="">请选择</option>');
    } else if (gradeid == "4") {
        $(".sel5").html("");
        $(".sel5").append('<option data-id="">请选择</option>');
    } else if (gradeid == "5") { //到最后了
        return;
    }
    var id = $(obj).find("option:selected").attr("data-id");
    if (!id) {
        return;
    }
    var selNum = parseInt(gradeid) + 1; //要灌入数据的位置
    var listLoad = layer.load();

    $.ajax({
        url: "organization/list.do",
        type: "POST",
        data: {
            id: id,
        },
        dataType: "json",
        async: false,
        success: function (data) {
            layer.close(listLoad);
            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                    closeBtn: 0
                }, function () {
                    location.reload();
                });
                return;
            }
            var result = data.result;
            if (result) {
                console.log(data)
                var list = data.list;
                $(".sel" + selNum).html("");
                if (list.length == 0) {
                    if (gradeid == "1") {
                        $(".sel2").html("");
                        $(".sel2").append('<option data-id="">无</option>');
                        $(".sel3").html("");
                        $(".sel3").append('<option data-id="">无</option>');
                        $(".sel4").html("");
                        $(".sel4").append('<option data-id="">无</option>');
                        $(".sel5").html("");
                        $(".sel5").append('<option data-id="">无</option>');
                    } else if (gradeid == "2") {
                        $(".sel3").html("");
                        $(".sel3").append('<option data-id="">无</option>');
                        $(".sel4").html("");
                        $(".sel4").append('<option data-id="">无</option>');
                        $(".sel5").html("");
                        $(".sel5").append('<option data-id="">无</option>');
                    } else if (gradeid == "3") {
                        $(".sel4").html("");
                        $(".sel4").append('<option data-id="">无</option>');
                        $(".sel5").html("");
                        $(".sel5").append('<option data-id="">无</option>');
                    } else if (gradeid == "4") {
                        $(".sel5").html("");
                        $(".sel5").append('<option data-id="">无</option>');
                    } else if (gradeid == "5") { //到最后了
                        return;
                    }
                    return;
                }
                $(".sel" + selNum).removeAttr("disabled");
                var str = "";
                str += '<option data-id="">' + text + '</option>';
                for (var i = 0; i < list.length; i++) {
                    str += '<option data-id="' + list[i].id + '">' + list[i].name + '</option>';
                };
                $(".sel" + selNum).append(str);
            } else {
                /**查询失败**/
                layer.msg("<p style='text-align:center'>查询失败!</p>");
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(listLoad);
            layer.msg("<p style='text-align:center'>查询失败!</p>");
        }
    });
};
/**
 * 修改设备时候再一次进行下一级查询
 * id(当前这一级的ID)
 * **/
function deleteEmptyString (id, gradeid) {
    if (!id) {
        return;
    }
    var listLoad = layer.load();
    $.ajax({
        url: "organization/list.do",
        type: "POST",
        data: {
            id: id,
        },
        dataType: "json",
        async: false,
        success: function (data) {
            layer.close(listLoad);
            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                    closeBtn: 0
                }, function () {
                    location.reload();
                });
                return;
            }
            var result = data.result;
            if (result) {
                var list = data.list;
                if (list.length == 0) {
                    return;
                };
                if (gradeid == "1") {
                    cascadeList2 = list;
                };
                if (gradeid == "2") {
                    cascadeList3 = list;
                };
                if (gradeid == "3") {
                    cascadeList4 = list;
                };
                if (gradeid == "4") {
                    cascadeList5 = list;
                };
            } else {
                /**查询失败**/
                layer.msg("<p style='text-align:center'>查询失败!</p>");
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(listLoad);
            layer.msg("<p style='text-align:center'>查询失败!</p>");
        }
    });
};
/**
 * 修改设备时候再一次进行下一级查询
 * id(当前这一级的ID)
 * **/
function gradeNextSearch (id, gradeid) {
    if (!id) {
        return;
    }
    var listLoad = layer.load();
    $.ajax({
        url: "organization/list.do",
        type: "POST",
        data: {
            id: id,
        },
        dataType: "json",
        async: false,
        success: function (data) {
            layer.close(listLoad);
            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                    closeBtn: 0
                }, function () {
                    location.reload();
                });
                return;
            }
            var result = data.result;
            if (result) {
                var list = data.list;
                if (list.length == 0) {
                    return;
                };
                if (gradeid == "1") {
                    cascadeList2 = list;
                };
                if (gradeid == "2") {
                    cascadeList3 = list;
                };
                if (gradeid == "3") {
                    cascadeList4 = list;
                };
                if (gradeid == "4") {
                    cascadeList5 = list;
                };
            } else {
                /**查询失败**/
                layer.msg("<p style='text-align:center'>查询失败!</p>");
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(listLoad);

            layer.msg("<p style='text-align:center'>查询失败!</p>");
        }
    });
};
/**
 * *
 * 默认查询一级组织机构信息
 *(新增时用)
 * ***/
function oSearchOrganization () {
    var oflag = false;
    emptyValue(); //清空数据
    var id = "000000000000"; //默认全国
    var listLoad = layer.load();
    $.ajax({
        url: "organization/list.do",
        type: "POST",
        data: {
            id: id,
        },
        dataType: "json",
        async: false,
        success: function (data) {
            layer.close(listLoad);
            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                    closeBtn: 0
                }, function () {
                    location.reload();
                });
                return;
            }
            var result = data.result;
            if (result) {
                cascadeList1 = data.list;
                oflag = true;
            } else {
                /**查询失败**/
                layer.msg("<p style='text-align:center'>查询失败!</p>");
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.close(listLoad);
            layer.msg("<p style='text-align:center'>查询失败!</p>");
        }
    });
    return oflag;
}
/**
 * 修改时候查询组织机构信息
 * uid:当前设备ID
 * **/
function editSearchOrganization (uid) {
    var flag = false;
    emptyValue(); //清空数据
    $.ajax({
        url: "organization/getPosition.do",
        type: "POST",
        data: {
            id: uid,
        },
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.login_error) { //data.msg=="用户未登录或者登录失效"
                layer.alert("您的帐号在别处登录，您已被迫下线!", {
                    closeBtn: 0
                }, function () {
                    location.reload();
                });
                return;
            }
            var result = data.result;
            if (result) {
                var length = data.countList ? data.countList : "";//绑定了几级行政机构
                countDisable = length;
                cascadeList1 = data.provinceList;//一级省份数据
                if (data.province) {//终端绑定的行政机构数据
                    selectFirstId = data.province[0].id;//第一级的ID
                }
                if (length == "1") {
                    gradeNextSearch(selectFirstId, 1); //下一级查询
                }
                if (length == "2") {
                    selectSecondId = data.city[0].id;
                    // cascadeList2 = data.cityList;
                    gradeNextSearch(selectFirstId, 1);
                    gradeNextSearch(selectSecondId, 2); //下一级查询
                }
                if (length == "3") {
                    selectSecondId = data.city[0].id;
                    // cascadeList2 = data.cityList;
                    selectThirdId = data.county[0].id;
                    // cascadeList3 = data.countyList;
                    gradeNextSearch(selectFirstId, 1);
                    gradeNextSearch(selectSecondId, 2);
                    gradeNextSearch(selectThirdId, 3); //下一级查询
                }
                if (length == "4") {
                    selectSecondId = data.city[0].id;
                    // cascadeList2 = data.cityList;
                    selectThirdId = data.county[0].id;
                    // cascadeList3 = data.countyList;
                    selectFourId = data.street[0].id;
                    gradeNextSearch(selectFirstId, 1);
                    gradeNextSearch(selectSecondId, 2);
                    gradeNextSearch(selectThirdId, 3);
                    gradeNextSearch(selectFourId, 4);
                    // cascadeList4 = data.streetList;
                }
                if (length == "5") {
                    selectSecondId = data.city[0].id;
                    // cascadeList2 = data.cityList;
                    selectThirdId = data.county[0].id;
                    // cascadeList3 = data.countyList;
                    selectFourId = data.street[0].id;
                    selectFiveId = data.village[0].id;
                    gradeNextSearch(selectFirstId, 1);
                    gradeNextSearch(selectSecondId, 2);
                    gradeNextSearch(selectThirdId, 3);
                    gradeNextSearch(selectFourId, 4);
                    // cascadeList4 = data.streetList;
                }
                flag = true;
            } else {
                /**查询失败**/
                layer.msg("<p style='text-align:center'>查询失败!</p>");
                flag = false;
            };
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            layer.msg("<p style='text-align:center'>查询失败!</p>");
        }
    });
    return flag;
}
/**
 * 清空默认数据
 *
 */
function emptyValue () {
    selectFirstId = "";
    selectSecondId = "";
    selectThirdId = "";
    selectFourId = "";
    selectFiveId = "";
    cascadeList1 = "";
    cascadeList2 = "";
    cascadeList3 = "";
    cascadeList4 = "";
    cascadeList5 = "";
}
/**
 * 处理undefined
 * **/
function checkValue (value) {
    var ovalue = (value == "" || value == undefined || value == null || value == "undefined" || value == "null") ? "" : value;
    return ovalue;
};
/* 手风琴效果类 */
var Accordion = function (el, multiple) {
    this.el = el || {}; gradeNextSearch
    this.multiple = multiple || false;
    var links = this.el.find('.link');
    links.on('click', {
        el: this.el,
        multiple: this.multiple
    }, this.down)
};
Accordion.prototype.down = function (e) {
    var $el = e.data.el;
    $this = $(this);
    $next = $this.next();

    $next.slideToggle();
    $this.parent().toggleClass('open');

    if (!e.data.multiple) {
        $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
    }
};
/* 区域监控树追加加载 */
function monitorFilter1 (treeId, parentNode, responseData) {
    console.log(treeId, parentNode, responseData);
    if (!responseData) return null;
    if (responseData.organizationList.length) {
        responseData.organizationList.forEach(function (item, index) {
            item.nocheck = true;
        })
    }
    if (responseData.masters.length) {
        responseData.masters.forEach(function (item, index) {
            responseData.organizationList.push(item);
        })
    }
    //原数组中加入children
    vm.zTreeMonitorArea = addzNodeChildren1(treeId, parentNode, responseData, vm.zTreeMonitorArea);
    return responseData.organizationList;
}
function monitorFilter2 (treeId, parentNode, responseData) {
    if (!responseData) return null;
    responseData.deviceList.forEach(function (item) {
        if (item.menuType == 2 && item.thirdparty == "local") {
            item.name = item.name + "（本地监控）"
        }
    });
    if (responseData.data.length) {
        responseData.data.forEach(function (item, index) {
            item.nocheck = true;
        })
    }
    if (responseData.deviceList.length) {
        responseData.deviceList.forEach(function (item, index) {
            responseData.data.push(item);
        })
    }
    vm.zTreeMonitorLabel = addzNodeChildren(treeId, parentNode, responseData, vm.zTreeMonitorLabel);
    return responseData.data;
}
function addzNodeChildren (treeId, parentNode, childNodes, list) {
    if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].deviceID == parentNode.deviceID) {
                if (Array.isArray(childNodes.data.deviceList)) {
                    list[i]._children = _clone(childNodes.data.deviceList);
                }
                break;
            }
            if (list[i]._children) {
                list[i]._children = addzNodeChildren(treeId, parentNode, childNodes, list[i]._children)
            }
        }
    }
    return list;
}
function addzNodeChildren1 (treeId, parentNode, childNodes, list) {
    if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
            //找到父节点位置
            if (list[i].id == parentNode.id) {
                list[i]._children = _clone(childNodes.organizationList);
                break;
            }
            if (list[i]._children) {
                list[i]._children = addzNodeChildren1(treeId, parentNode, childNodes, list[i]._children)
            }
        }
    }
    return list;
}
function _clone (obj) {
    var o;
    if (typeof obj !== "object") {
        o = obj;
    } else if (obj === null) {
        o = null;
    } else if (obj instanceof Array) {
        o = [];
        for (var i = 0; i < obj.length; i++) {
            o.push(_clone(obj[i]));
        }
    } else {
        o = {};
        for (var key in obj) {
            o[key] = _clone(obj[key]);
        }
    }
    return o;
}
/* 点击区域监控数据方法 */
function onMonitorAreaClick (e, treeId, treeNode) {
    console.log('点击区域监控数据方法');
    var zTree = $.fn.zTree.getZTreeObj("treeDemo1");
    treeNode["menuType"] = (+$('#planDiolag_planType').val() !== 3 || +$('#addHuaMianOption').val() !== 1) ? 2 : 1
    zTree.expandNode(treeNode);
}
/* 点击标签分组监控数据方法 */
function onMonitorLabelClick (e, treeId, treeNode) {
    console.log('点击标签分组监控数据方法');
    var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
    zTree.expandNode(treeNode);
}
/* 监控选中 */
function onMonitorCheck (e, treeId, treeNode) {
    console.log('点击监控选中方法', treeNode);
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    processingNode(treeNode);
    // 统计已选中的监控数
    function computeSelectNum () {
        // 获取行政区域所有勾选的节点
        var checkedTree1Node = $.fn.zTree.getZTreeObj('treeDemo1').getCheckedNodes(true);
        var commNode1 = [];
        checkedTree1Node.forEach(function (item, index) {
            if (!item.isParent && item.checked) {
                commNode1.push(item);
            }
        });
        // 获取所有标签分组被勾选的节点
        var commNode2 = [];
        if ($("#addHuaMianOption").val() === '2') {
            var checkedTree2Node = $.fn.zTree.getZTreeObj('treeDemo2').getCheckedNodes(true);
            checkedTree2Node.forEach(function (item, index) {
                if (!item.isParent && item.checked) {
                    commNode2.push(item);
                }
            });
        }
        var monitorCount = parseInt(commNode1.length) + parseInt(commNode2.length);
        $('.leftMonitorSelect').text(monitorCount);
    }
    // 创建递归函数
    function processingNode (treeNode) {
        console.log(treeNode)
        if (treeNode.isParent) {
            if (treeNode.checked === true) {
                zTree.checkNode(treeNode, true, true);
            } else {
                zTree.checkNode(treeNode, false, false);
            }
            // 统计已选中的监控数
            computeSelectNum()
            // 父节点
            // if (treeNode.open) {
            //     treeNode.children.forEach(function (item) {
            //         if (item.isParent) {
            //             processingNode(item);
            //         } else {
            //             if ((item.groupStatus == 1) && item.faultedFlag && ((item.online == 0) || (item.status=='OFF'))) {
            //                 layer.msg('离线或故障监控不支持播放');
            //                 zTree.checkNode(item, false, true);
            //             }
            //             if ((item.groupStatus == 0) || ((item.online== 0 || item.status=='OFF') && (item.faultedFlag !=1))) {
            //                 layer.msg('离线或故障监控不支持播放');
            //                 zTree.checkNode(item, false, true);
            //             }
            //             if (item.online == null || item.status == null) {
            //                 layer.msg('离线或故障监控不支持播放');
            //                 zTree.checkNode(item, false, true);
            //             }
            //             // 统计已选中的监控数
            //             computeSelectNum();
            //         }
            //     })
            // } else {
            //     zTree.reAsyncChildNodes(treeNode, "refresh", false, function () {
            //         if (treeNode.checked) {
            //             zTree.checkNode(treeNode, true, true);
            //         } else {
            //             zTree.checkNode(treeNode, false, false);
            //         }
            //         treeNode.children.forEach(function (item) {
            //             if (item.isParent) {
            //                 processingNode(item);
            //             } else {
            //                 if ((item.groupStatus == 1) && item.faultedFlag && ((item.online == 0) || (item.status=='OFF'))) {
            //                     layer.msg('离线或故障监控不支持播放');
            //                     zTree.checkNode(item, false, true);
            //                 }
            //                 if ((item.groupStatus == 0) || ((item.online== 0 || item.status=='OFF') && (item.faultedFlag !=1))) {
            //                     layer.msg('离线或故障监控不支持播放');
            //                     zTree.checkNode(item, false, true);
            //                 }
            //                 if (item.online == null || item.status == null) {
            //                     layer.msg('离线或故障监控不支持播放');
            //                     zTree.checkNode(item, false, true);
            //                 }
            //                 // 统计已选中的监控数
            //                 computeSelectNum();
            //             }
            //         })
            //     });
            // }
        } else {
            if (treeNode.checked === true) {
                zTree.checkNode(treeNode, true, true);
            } else {
                zTree.checkNode(treeNode, false, false);
            }
            // if(treeNode && treeNode.menuType === 2){
            //     if ((treeNode.groupStatus == 1) && treeNode.faultedFlag && ((treeNode.online == 0) || (treeNode.status=='OFF'))) {
            //         layer.msg('离线或故障监控不支持播放');
            //         zTree.checkNode(treeNode, false, true);
            //     }
            //     if ((treeNode.groupStatus == 0) || ((treeNode.online== 0 || treeNode.status=='OFF') && (treeNode.faultedFlag !=1))) {
            //         layer.msg('离线或故障监控不支持播放');
            //         zTree.checkNode(treeNode, false, true);
            //     }
            //     if (treeNode.online == null || treeNode.status == null) {
            //         layer.msg('离线或故障监控不支持播放');
            //         zTree.checkNode(treeNode, false, true);
            //     }
            // }else {
            //     if(treeNode && treeNode.online && treeNode.online === 1){
            //         if(treeNode.checked === true){
            //             zTree.checkNode(treeNode, true, true);
            //         }else {
            //             zTree.checkNode(treeNode, false, false);
            //         }
            //     }else {
            //         layer.msg('离线或故障监控不支持播放');
            //         zTree.checkNode(treeNode, false, true);
            //     }
            // }
            // 统计已选中的监控数
            computeSelectNum();
        }

    }
}
/* 时间转换 yyyy-MM-dd hh:mm:ss */
function dateToString (createtime) {
    function add0 (m) { return m < 10 ? '0' + m : m }
    var time = new Date(createtime);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
/**
 *智能标注相关代码
 *
 */


(function (win) {
    //如果是离线地图直接返回
    if (offlineMap) {
        return;
    }
    // 百度地图API功能
    var map = new BMap.Map("Map");
    map.centerAndZoom(new BMap.Point(117.269945, 31.86713), 13);
    //map.enableScrollWheelZoom(true);
    var index = 0;
    var myGeo = new BMap.Geocoder(); //创建一个地址解析器的实例
    /**
     * 自执行函数
     * @map      百度map实例
     * @Geocoder 百度Geocoder实例
     * @win      window
     * @$        jquery对象
     */
    ;
    (function (map, Geocoder, win) {
        var sum, i = 0;
        // 编写自定义函数,创建标注
        function addMarker (point) {
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
        };
        var B = Batch_parsing = function (map) {
            this.map = map;
            this.Unresolved = [];
            this.Parsed = [];
            this.total = 0;
            this.dom;
        };
        B.prototype = {
            /**
             * 批量地址解析
             * @addreslist {Array} 地址列表
             * @total {Number} 数据总条数
             * @totalpage {Number} 当前页
             * */
            allList: function (addreslist, total, totalpage) {
                sum = 0, this.Unresolved = [], this.Parsed = [];
                i = 0;
                // if (this.total == 0) {
                this.total = total;
                // };
                if (!this.dom) {
                    this.dom = $(".layer_count");
                }
                var strtime = new Date();
                this.points(strtime, addreslist, totalpage);
            },
            /**
             * 单个地址解析
             * @strtime 开始时间
             * @data {Array} 地址列表
             * @totalpage {Number} 当前页面
             * */
            points: function (strtime, data, totalpage) {
                var that = this;
                if (data.length == 0 || i == data.length) {
                    if (data.length == 0) {
                        console.log("数据为零");
                    } else {
                        console.log("递归结束");
                    }
                    return;
                }
                /**
                 * 百度地址解析
                 * @data[i].address {String} 详细地址
                 * @fn {Function} 回调函数
                 * @data[i].city {String} 城市
                 * */
                myGeo.getPoint(data[i].address, function (point) {
                    if (point) {
                        /**
                         * 把已经解析 的存起来
                         * */
                        that.Parsed.push({
                            id: data[i].id,
                            city: data[i].city,
                            address: data[i].address,
                            lng: point.lng,
                            lat: point.lat,
                            _addres: data[i]._addres,
                            menuType: data[i].menuType,
                            thirdParty: data[i].thirdparty
                        });

                        //sum = sum + 1;
                        //console.log(sum);
                        //console.log("用时=" + (new Date() - strtime));
                    } else {
                        /**
                         * 存储未被解析的数据
                         * */
                        that.Unresolved.push({
                            id: data[i].id,
                            city: data[i].city,
                            address: data[i].address,
                            _addres: data[i]._addres,
                            menuType: data[i].menuType,
                            thirdParty: data[i].thirdparty
                        });
                    }
                    that.total--; //统计条数
                    i++;
                    that.dom.html("剩余<span style='color:red;'> " + that.total + "</span> 条数据,当前转换是第" + totalpage + "页");
                    that.points(strtime, data, totalpage); //递归调用自己
                }, data[i].city);
            },
            /**
             * 单个地址一次解析
             * @addres {String} 详细地址
             * @city  {String} 城市
             * @id {String|Number} id唯一值
             * */
            point: function (addres, city, id) {
                sum = 0, this.Unresolved = [];
                var strtime = new Date();
                var that = this;
                /**
                 * 百度地址解析
                 * @addres {String} 详细地址
                 * @fn {Function} 回调函数
                 * @city {String} 城市
                 * */
                myGeo.getPoint(addres, function (point) {
                    if (point) {
                        console.log("已经解析的，城市=" + city + "，地址=" + addres + "，lng=" + point.lng + "  |   lat=" + point.lat);
                        var address = new BMap.Point(point.lng, point.lat);
                        addMarker(address);
                        //								sum = sum + 1;
                        //								console.log(sum);
                        //								console.log("用时=" + (new Date() - strtime));
                    } else {
                        /**
                         * 存储未被解析的数据
                         *
                         * */
                        that.Unresolved.push({
                            id: id,
                            city: city,
                            address: addres
                        });
                    }
                }, city);
            },
            constructor: B

        };
        win.Batch_parsing = B;
    })(map, myGeo, window);

    var analysis = new Batch_parsing(map);
    var pages, totalpage = 2,
        layer_id; //第一页,数据多少页码,统计多少数据弹框
    var This_analysis = []; //解析以后的数据
    /**
     * 主方法
     * @data {Array} 地址数据列表
     * */
    function main (data) {
        /*检查是否解析完毕*/
        var timer = setInterval(function () {
            if (analysis.Unresolved.length + analysis.Parsed.length == data.length) {
                clearInterval(timer);
                This_analysis.push({
                    id: pages,
                    Unresolved: analysis.Unresolved,
                    Parsed: analysis.Parsed
                });
                /*如果有解析成功的更新数据*/
                if (analysis.Parsed.length) {
                    //修改数据成功以后再次请求数据再次标注
                    var data_url = {
                        action: "device/conversionDevice.do",
                        jsonString: JSON.stringify(analysis.Parsed)
                    };
                    ajaxdata(data_url, function (result, data) {
                        if (result) {
                            pages++;
                            getdata(pages); //再次请求数据进行标注
                        } else {
                            layer.close(layer_id);
                            layer.msg(data.msg);
                        }
                    });
                } else {
                    pages++;
                    getdata(pages); //再次请求数据进行标注
                }

            }
        }, 200);
    };

    /**
     * Ajax获取数据
     * @p {Number} 页码
     *
     * */
    function getdata (p) {

        if (pages == totalpage) {
            console.log("渲染完毕");
            console.log(This_analysis);
            /*开始第二次标注*/
            var er_data = [];
            //把所有未标注成功的数据收集起来
            for (var r = 0; r < This_analysis.length; r++) {
                er_data = er_data.concat(This_analysis[r].Unresolved);
            }

            /*判断收集起来的数据长度*/
            if (er_data.length > 0) {
                for (r = 0; r < er_data.length; r++) {
                    if (!er_data[r]._addres) {
                        er_data.splice(r, 1);
                    }
                };
                if (er_data.length > 0) {
                    analysis.allList(er_data, er_data.length, pages); //渲染数据
                    main(er_data); //执行核心方法
                } else {
                    layer.close(layer_id);
                    layer.open({
                        title: "标注完毕",
                        content: '<p style="padding:20px;font-size:16px; text-align: center;">标注通过:' + (This_analysis.length ? This_analysis[0].Parsed.length : 0) + '条,未通过:' + This_analysis[0].Unresolved.length + '条</p>',
                        btn: ['确定'],
                        yes: function (index, layero) {
                            location.reload(); //重新刷新页面
                        },
                        cancel: function () {
                            location.reload(); //重新刷新页面
                        }
                    });
                }
            } else {
                //一次标注完毕【全部过】
                var Parsedliength = 0;
                for (var j1 = 0; j1 < This_analysis.length; j1++) {
                    Parsedliength += This_analysis[j1].Parsed.length;
                }
                layer.close(layer_id);
                layer.open({
                    title: "标注完毕",
                    content: '<p style="padding:20px;font-size:16px; text-align: center;">标注通过:' + (Parsedliength) + '条,未通过:0条</p>',
                    btn: ['确定'],
                    yes: function (index, layero) {
                        location.reload(); //重新刷新页面
                    },
                    cancel: function () {
                        location.reload(); //重新刷新页面
                    }
                });
            }
            return;
        }
        if (pages == (totalpage + 1)) {

            layer.close(layer_id);
            /**
             * 1、把所有通过的数据 相加统计为已通过的数据。
             * 2、数组最后一条数据是 第二次标注，第二次标注会过滤掉数据。所有计算规则如下
             *    除第二次标注的数据，统计失败的数据总数 【f】
             *    【f】减去第二次标注的（通过的与未通过的）=被筛选出去没有满足条件的数据【d】
             *    第二次标注失败的数据加【d】则是未通过的数据
             */
            var parsed_data = 0,
                unresolved_all_data = 0,
                Unresolved = 0;
            if (This_analysis) {
                for (var t = 0; t < This_analysis.length; t++) {
                    parsed_data += This_analysis[t].Parsed.length;
                    unresolved_all_data += This_analysis[t].Unresolved.length; //所有未通过的数据
                }

                var secenddata = This_analysis[This_analysis.length - 1]; //第二次标注的数据
                unresolved_all_data = unresolved_all_data - secenddata.Unresolved.length; //第一次失败的数据
                var padd_data = unresolved_all_data - secenddata.Unresolved.length - secenddata.Parsed.length; //被筛选丢掉的数据
                Unresolved = padd_data + secenddata.Unresolved.length; //未通过的数据
            }

            //判断第二次未通过的条数


            layer.open({
                title: "标注完毕",
                content: '<p style="padding:20px;font-size:16px; text-align: center;">标注通过:' + (parsed_data) + '条,未通过:' + Unresolved + '条</p>',
                btn: ['确定'],
                yes: function (index, layero) {
                    location.reload(); //重新刷新页面
                },
                cancel: function () {
                    location.reload(); //重新刷新页面
                }
            });

            return;
        }
        /*第一次请求第一页数据*/
        if (pages == undefined) {
            var layer_dom = '<div>\
					    <div style="width:60px;height:24px;margin: 0 auto;margin-top: 20px;margin-bottom: 25px;background: url(resource/common/js/layer/layer/skin/default/loading-0.gif) no-repeat"></div>\
					    <div class="layer_count" style="margin-bottom:15px;padding:0 10px; font-size:15px;text-align: center;"></div>\
					</div>';
            layer_id = layer.open({
                id: 'znbzLayer',
                type: 1,
                title: false,
                closeBtn: 0,
                content: layer_dom,
                area: [280, 120],
                success: function () {
                    $("#znbzLayer").parent().addClass('znbz-layer');
                }
            });
            pages = 1;
        }

        var data_url = {
            action: "device/getNulltList.do",
            isSign: true,
            pageNum: p ? p : 1,
            pageSize: 1000,
            menuType: terminalType
        };
        ajaxdata(data_url, function (result, data) {
            if (result) {
                if (!p) {
                    if (data.list.total <= 1000) {
                        totalpage = 2;
                    } else {
                        totalpage = Math.ceil(data.list.total / 1000) + 1;
                    }
                    $(".layer_count").html("共计<span style='color:red;'> " + data.list.total + " </span>条数据,需要" + totalpage + "次转换");
                }
                //数据处理
                Processing_data(data.list.list, data.list.total);
            } else {
                layer.close(layer_id);
                layer.msg(data.msg);
            }
        });
    }
    /**
     * 数据处理
     * @data {Array} 数据
     * @total {Number} 总条数
     */
    function Processing_data (data, total) {
        var data_list = [],
            city_arry, addres, city;

        for (var i = 0; i < data.length; i++) {
            addres = "";
            city = "";
            if (data[i].echoAddress && data[i].name) {
                city_arry = data[i].echoAddress.split("/");
                /*直辖市的*/
                if (city_arry[0].indexOf("市") > 0) {
                    addres = city_arry[0];
                    /*如果是选择了直辖市和区*/
                    if (city_arry[1] && city_arry[1].indexOf("请") < 0) {
                        addres += city_arry[1];
                    }
                    /*如果是选择了直辖市、区和街道*/
                    if (city_arry[2] && city_arry[2].indexOf("请") < 0) {
                        addres += city_arry[2];
                    }
                    /*如果是选择了直辖市、区、街道和社区*/
                    if (city_arry[3] && city_arry[3].indexOf("请") < 0) {
                        addres += city_arry[3];
                    }
                    addres += data[i].name;
                    city = city_arry[0];
                } else {
                    /*只选择了省*/
                    addres = city_arry[0];
                    /*如选择了省和市*/
                    if (city_arry[2] && city_arry[1].indexOf("请") < 0) {
                        addres += city_arry[1];
                    }
                    /*如选择了省、市、区*/
                    if (city_arry[2] && city_arry[2].indexOf("请") < 0) {
                        addres += city_arry[2];
                    }
                    /*如选择了省、市、区、街道*/
                    if (city_arry[3] && city_arry[3].indexOf("请") < 0) {
                        addres += city_arry[3];
                    }
                    addres += data[i].name;
                    city = ((city_arry[1] && city_arry[1].indexOf("请") > 0) ? city_arry[0] : city_arry[1]);
                }
                data_list.push({
                    address: addres,
                    city: city,
                    id: data[i].id,
                    _addres: data[i].address,
                    menuType: data[i].menuType,
                    thirdparty: data[i].thirdparty
                });
            }
        };
        console.log(data_list, "第" + pages + "次,过滤出来的可以转换的数据");
        /*如果过滤出来的数据为空,则再次请求数据.不为空侧处理数据*/
        if (data_list.length) {
            analysis.allList(data_list, total, pages); //渲染数据
            main(data_list); //执行核心方法

        } else {
            pages++;
            getdata(pages); //再次请求数据进行标注
        }

    }
    win.Intelligent_annotation = {
        getdata: getdata
    };
})(window);