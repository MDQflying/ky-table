import React, {
    PureComponent,
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect,
  } from 'react';
  
  import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    InputNumber,
    Button,
    Modal,
    Divider,
    message,
    // Switch,
    Tree,
    Radio,
  } from 'antd';
//   import { connect } from 'dva';
//   import IconPicker from '@/components/IconPicker';
  import request from './request'; 
  
//   import './index.scss';
  
  const { TreeNode } = Tree;
  const { Option } = Select;
  
  /**
   * 添加功能模块
   */
  function addModule({
    actionUrl,
    hidden,
    moduleCode,
    moduleDesc,
    moduleIcon,
    moduleId,
    moduleName,
    moduleType,
    parentId,
    sort,
    subsysCode,
  }) {
    return request('/dev-basp-system/module/add', {
      method: 'POST',
      body: {
        actionUrl,
        hidden,
        moduleCode,
        moduleDesc,
        moduleIcon,
        moduleId,
        moduleName,
        moduleType,
        parentId,
        sort,
        subsysCode,
      },
    });
  }
  
  function updModuleStatus({ moduleId, moduleType }, status) {
    return request('/dev-basp-system/module/state', {
      method: 'POST',
      body: [{ moduleId, moduleType, status }],
    });
  }
  
  const ModuleTree = forwardRef((props, ref) => {
    const { onSelect = () => {} } = props;
  
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);
  
    function onExpand(expanded) {
      setExpandedKeys(expanded);
    }
  
    async function getDatas() {
      const res = await request('/dev-basp-system/module/selectModule', {
        method: 'POST',
        body: {
          status: 1,
        },
      });
      debugger;
      if (res && res.succ !== 'ok') {
        // todo
      } else {
        setTreeData(res.result);
      }
    }
  
    useImperativeHandle(ref, () => ({
      refresh: () => {
        getDatas();
      },
    }));
  
    useEffect(() => {
      getDatas();
    }, []);
  
    function TreeNodeTitle(titleProps) {
      const { item } = titleProps;
      const { moduleName } = item;
      return (
        <div className="tree-node-title">
          <div>{moduleName}</div>
        </div>
      );
    }
  
    function renderTreeNodes(datas) {
      const nodes = datas.map(item => {
        if (item.childs) {
          return (
            <TreeNode
              title={<TreeNodeTitle item={item} />}
              key={item.moduleId}
              dataRef={item}
            >
              {renderTreeNodes(item.childs)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.moduleId} {...item} />;
      });
      return nodes;
    }
    return (
      <Tree
        ref={ref}
        showLine
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
      >
        {renderTreeNodes(treeData)}
      </Tree>
    );
  });
  
  const FormItem = Form.Item;
  // actionUrl
  // :
  // ""
  // appType
  // :
  // 1
  // helpUrl
  // :
  // ""
  // hidden
  // :
  // "N"
  // moduleCode
  // :
  // "test_focus"
  // moduleDesc
  // :
  // "test_focus"
  // moduleIcon
  // :
  // ""
  // moduleId
  // :
  // ""
  // moduleName
  // :
  // "test_focus"
  // moduleType
  // :
  // 3
  // parentId
  // :
  // 1434925
  // sort
  // :
  // 5
  // subSysCode
  // :
  // "kuaiyun"
  // systemId
  // :
  // 888889183
  
  const CreateForm = props => {
    const [addForm] = Form.useForm();
    // const subsysCode = sessionStorage.getItem('systemCode');
    // const subsysName = sessionStorage.getItem('systemName');
    const {
      modalVisible,
      parentType,
      parentId = 0,
      subsysCode,
      subsysName,
      // form,
      refresh,
      handleModalVisible,
    } = props;
    const okHandle = () => {
      addForm.validateFields().then(async fieldsValue => {
        const {
          actionUrl = '',
          hidden,
          moduleCode,
          moduleDesc = '',
          moduleIcon = '',
          moduleId,
          moduleName,
          moduleType,
          sort,
        } = fieldsValue;
        const res = await addModule({
          actionUrl,
          hidden,
          moduleCode,
          status: 1,
          moduleDesc,
          moduleIcon,
          moduleId,
          moduleName,
          moduleType,
          sort,
          subsysCode,
          parentId,
        });
        if (res.succ !== 'ok') {
          message.error(res.msg);
        } else {
          message.success('添加成功');
          // addForm.resetFields();
          handleModalVisible();
          refresh();
        }
      });
    };
  
    function getInitModuleType(_parentType) {
      if (!_parentType) {
        return 1;
      }
      if (_parentType === 1) {
        return 2;
      }
      return '';
    }
  
    return (
      <Modal
        destroyOnClose
        width={650}
        title="新增模块"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <Form
          form={addForm}
          name="addForm"
          initialValues={{
            subsysName,
            moduleType: getInitModuleType(parentType),
          }}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="子系统名称"
            name="subsysName"
            rules={[
              {
                required: true,
                message: '请填写子系统名称',
              },
            ]}
          >
            <Input disabled />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块名称"
            name="moduleName"
            rules={[
              {
                required: true,
                message: '请输入模块名称',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块编码"
            name="moduleCode"
            rules={[
              {
                required: true,
                message: '请输入模块编码',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块描述"
            name="moduleDesc"
            rules={[
              {
                required: true,
                message: '请输入模块描述',
              },
            ]}
          >
            <Input.TextArea rows={3} placeholder="请输入" />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="图标样式"
            name="moduleIcon"
            // rules={}
          >
            {/* <IconPicker /> */}
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块类型"
            name="moduleType"
            rules={[
              {
                required: true,
                message: '请选择模块类型',
              },
            ]}
          >
            <Radio.Group disabled={!parentType || parentType === 1}>
              {!parentType && <Radio value={1}>子系统</Radio>}
              {parentType === 1 && <Radio value={2}>业务模块</Radio>}
              {(parentType === 2 || parentType === 3) && [
                <Radio value={3}>菜单</Radio>,
                <Radio value={4}>功能按钮</Radio>,
              ]}
            </Radio.Group>
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="是否隐藏"
            name="hidden"
            rules={[
              {
                required: true,
                message: '请选择是否隐藏',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="N">否</Radio>
              <Radio value="Y">是</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="功能URL"
            name="actionUrl"
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="顺序号"
            name="sort"
            rules={[
              {
                required: true,
                type: 'number',
                message: '请输入顺序号',
              },
            ]}
          >
            <InputNumber placeholder="请输入" />
          </FormItem>
        </Form>
      </Modal>
    );
  };
  
  function UpdateForm(props) {
    const {
      refresh = () => {},
      selectedModule = {},
      handleModalVisible = () => {},
      updateStatus = () => {},
      values = {},
    } = props;
    const {
      subsysCode, // roleId
    } = values;
    const [form] = Form.useForm();
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
    const updateModule = () => {
      form.validateFields().then(async fieldsValue => {
        const {
          parentId,
          actionUrl,
          hidden,
          moduleCode,
          moduleDesc,
          moduleIcon,
          moduleId,
          moduleName,
          moduleType,
          sort,
        } = fieldsValue;
  
        const res = await request('/dev-basp-system/module/update', {
          method: 'POST',
          body: {
            actionUrl,
            hidden,
            moduleCode,
            moduleDesc,
            moduleIcon,
            moduleId,
            moduleName,
            moduleType,
            parentId,
            sort,
            subsysCode,
          },
        });
        if (res.result !== 1) {
          message.error(res.msg);
        } else {
          message.success('修改成功');
          refresh();
        }
      });
    };
  
    useEffect(() => {
      form.setFieldsValue(values);
    }, [JSON.stringify(values)]);
  
    const { moduleType, status, moduleId } = values;
    return (
      <Card
        size="small"
        title="模块信息"
        extra={
          <span>
            {moduleType !== 4 && (
              <Button
                disabled={!moduleId}
                onClick={() => handleModalVisible(true, moduleId, moduleType)}
                size="small"
                type="primary"
              >
                添子模块
              </Button>
            )}
            <Divider type="vertical" />
            <Button
              disabled={!moduleId}
              onClick={() => {
                updateModule();
              }}
              size="small"
              type="primary"
            >
              保存
            </Button>
            <Divider type="vertical" />
            <Button
              type={status === 1 ? 'danger' : 'primary'}
              onClick={() => updateStatus(selectedModule)}
              disabled={!moduleId}
              size="small"
            >
              {status === 1 ? '禁用' : '启用'}
            </Button>
          </span>
        }
      >
        <Form form={form} name="updateForm" {...formLayout}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="子系统名称"
            name="subsysName"
            rules={[
              {
                required: true,
                message: '请填写子系统名称',
              },
            ]}
          >
            <Input disabled />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="父模块ID"
            name="parentId"
          >
            <Input disabled placeholder="如：88888888+rolecodeDemo" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块ID"
            name="moduleId"
          >
            <Input disabled />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块名称"
            name="moduleName"
          >
            <Input placeholder="请输入" />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块编码"
            name="moduleCode"
            rules={[
              {
                required: true,
                message: '请输入模块编码',
              },
            ]}
          >
            <Input placeholder="请输入" />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块描述"
            name="moduleDesc"
            rules={[
              {
                required: true,
                message: '请输入模块描述',
              },
            ]}
          >
            <Input.TextArea rows={3} placeholder="请输入" />
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="图标样式"
            name="moduleIcon"
          >
            {/* <IconPicker /> */}
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="模块类型"
            name="moduleType"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select disabled placeholder="请选择">
              <Option value={1}>子系统</Option>
              <Option value={2}>业务模块</Option>
              <Option value={3}>菜单</Option>
              <Option value={4}>功能按钮</Option>
            </Select>
          </FormItem>
  
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="是否隐藏"
            name="hidden"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value="N">否</Radio>
              <Radio value="Y">是</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="功能URL"
            name="actionUrl"
          >
            <Input placeholder="请输入" />
          </FormItem>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="顺序号"
            name="sort"
          >
            <InputNumber placeholder="请输入" />
          </FormItem>
        </Form>
      </Card>
    );
  }
  
//   @connect(() => ({}))
  class Page extends PureComponent {
    state = {
      selectedModule: {},
      parentId: 0,
      parentType: '',
      // moduleTreeRandom: Math.random(), // 用来刺激树做刷新
      modalVisible: false,
    };
  
    handleModalVisible = (flag, parentId, parentType) => {
      this.setState({
        modalVisible: !!flag,
        parentType,
        parentId,
      });
      if (!flag) {
        this.refresh();
      }
    };
  
    refresh = () => {
      this.treeRef.current.refresh();
      // this.setState({
      //   moduleTreeRandom: Math.random(),
      // });
    };
  
    handleAdd = async fields => {
      const res = await request('/dev-basp-system/role/add', {
        method: 'POST',
        body: {
          ...fields,
          roleId: '',
        },
      });
      if (res.result !== 1) {
        message.error(res.msg);
      } else {
        message.success('添加成功');
        this.handleModalVisible();
      }
    };
  
    onModuleSelect = (selected, e) => {
      this.setState({
        selectedModule: e.node.dataRef,
      });
    };
  
    updateStatus = async module => {
      const res = await updModuleStatus(module, 0);
      // const res = await updModuleStatus(module, module.status === 1 ? 0 : 1);
      if (res.succ !== 'ok') {
        // TODO
      } else {
        message.success('修改成功');
        this.refresh();
      }
    };
  
    treeRef = React.createRef();
  
    render() {
      const {
        selectedModule,
        modalVisible,
        formVals,
        parentId,
        parentType,
      } = this.state;
      const updateProps = {
        handleUpdate: () => {},
        refresh: () => {
          this.refresh();
        },
        values: selectedModule,
      };
      const { subsysCode, subsysName } = selectedModule;
      const createProps = {
        modalVisible,
        parentId,
        parentType,
        subsysCode,
        subsysName,
  
        formVals,
        handleModalVisible: this.handleModalVisible,
      };
      return (
        <div style={{ height: '100%', padding: '20px 24px' }}>
          <CreateForm {...createProps} />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24}>
              <Card
                extra={[
                  // <Switch
                  //   checkedChildren="开"
                  //   unCheckedChildren="关"
                  //   defaultChecked
                  //   onChange={() => {}}
                  // />,
                  <Button
                    type="link"
                    onClick={() => {
                      this.handleModalVisible(true, 0);
                    }}
                  >
                    添加子系统
                  </Button>,
                ]}
                style={{ height: '100%' }}
                size="small"
                title="重货底盘运力系统"
              >
                <ModuleTree ref={this.treeRef} onSelect={this.onModuleSelect} />
              </Card>
            </Col>
  
            <Col md={12} sm={24}>
              {/* {selectedModule && ( */}
              <UpdateForm
                {...updateProps}
                handleModalVisible={this.handleModalVisible}
                updateStatus={() => this.updateStatus(selectedModule)}
              />
              {/* )} */}
            </Col>
          </Row>
        </div>
      );
    }
  }
  
  export default Page;
  