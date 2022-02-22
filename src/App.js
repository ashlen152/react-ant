import './App.less';
import { Layout, Form, Select, Tree, Col, Button, Row, Modal, Input, Space, Card, message } from 'antd';
import { FolderFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import TreeTitle from './TreeTitle';
const { Content } = Layout;

const visibleTypes = Object.freeze({
  "everyOne": {
    key: '1',
    title: 'Visible To Everyone'

  }, "onlyMe": {
    key: '2',
    title: 'Visible To only Me'

  }, "specificUser": {
    key: '3',
    title: 'Visible to specific users'
  }
})

function App() {
  const [data, setData] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalSelectDataToFolderVisible, setIsModalSelectDataToFolderVisible] = useState(true)
  const [newFolder, setNewFolder] = useState({
    key: '',
    title: '',
    visible: visibleTypes.everyOne.key,
    visibleUsers: []
  })


  useEffect(() => {
    setData([
      {
        title: 'Bundle items',
        visible: '1',
        key: '1',
      },
      {
        title: 'Do you see this boon',
        visible: '1',
        key: '2',
      },
      {
        title: 'Error data all here',
        visible: '1',
        key: '3',
      },
      {
        title: 'Profit < $75 - (1.0K)',
        visible: '1',
        key: '4',
      },
      {
        title: 'Meltable ASINs - (3)',
        visible: '1',
        key: '5',
      },
      {
        title: 'No FBA FBM Sell Price - (2)',
        visible: '1',
        key: '6',
      },
    ])
    setUsers([
      {
        name: 'Jason Bo',
        key: '1'
      },
      {
        name: 'Sahara Kim',
        key: '2'
      }
    ])
  }, [])

  const onSelect = (selectedKeys, info) => {
    setSelectedData(selectedKeys)
  }

  const onDrop = (info) => {
    const dragKey = info.dragNode.key;
    const dropPos = info.dropPosition;

    let swapValue = null;
    let tempData = data.filter(currentData => {
      if (currentData.key !== dragKey) {
        return true;
      }
      else {
        swapValue = currentData
        return false
      }
    });

    if (dropPos === -1) {
      tempData.unshift(swapValue)
    }
    else {
      tempData.splice(dropPos, 0, swapValue)
    }

    setData(tempData)
  }

  const clearFormNewFolder = () => {
    setNewFolder({
      title: '',
      visible: visibleTypes.everyOne.key,
      visibleUsers: []
    })
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setNewFolder({ ...newFolder, key: data.length + 1 })
    setData([...data, newFolder])
    clearFormNewFolder();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    clearFormNewFolder();
    setIsModalVisible(false);
  };

  const handleOnChangeNewFolder = (event) => {
    setNewFolder({
      ...newFolder,
      [event.target.name]: event.target.value
    })
  }

  const validateSaveButton = () => {
    if (newFolder.title !== '' && visibleTypes.specificUser.key !== newFolder.visible) {
      return false
    }

    if (newFolder.visible === visibleTypes.specificUser.key && newFolder.visibleUsers && newFolder.visibleUsers.length > 0) {
      return false
    }
    return true
  }

  return (
    <Modal visible={isModalSelectDataToFolderVisible} width="50vw" footer={null}>
      <Content>
        <h2>
          Move Selected Data to Folders
        </h2>
        <Form
          // form={form}
          layout="vertical"
        >
          <Form.Item label="Folder"  >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
              optionFilterProp="children"
              onChange={(value) => setSelectedData([value])}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              value={selectedData}
            >
              {data.map(currentData => <Select.Option key={currentData.key} value={currentData.key}>{currentData.title}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item >
            <Card>
              <Search style={{ marginBottom: 8 }} placeholder="Search" />
              <Tree
                allowDrop={info => info.dropPosition !== 0}
                showIcon
                blockNode
                icon={<FolderFilled className='tree-icon' />}
                titleRender={(nodeData) =>
                (<TreeTitle title={nodeData.title}
                  visible={Object.values(visibleTypes).find(type => type.key === nodeData.visible).title}
                />)}
                onSelect={onSelect}
                onDrop={onDrop}
                className="tree-folder"
                treeData={data}
                selectedKeys={selectedData}
                draggable={
                  { icon: false, nodeDraggable: false }}
              // onDragStart
              />

            </Card>
          </Form.Item>
          <Row>
            <Col span={10} style={{ textAlign: 'left' }}>
              <Button
                type='primary'
                onClick={
                  showModal
                }
              >
                Add New Folder
              </Button>
            </Col>
            <Col span={14} style={{ textAlign: 'right' }}>
              <Button
                onClick={() => {
                  setIsModalSelectDataToFolderVisible(false)
                }}

                style={
                  {
                    marginRight: "10px"
                  }
                }
              >
                CANCEL
              </Button>
              <Button type="primary" onClick={
                () => {
                  message.success('Request move products save success')
                  setIsModalSelectDataToFolderVisible(false)
                }

              } disabled={selectedData.length < 1}>
                SAVE
              </Button>
            </Col>
          </Row>
        </Form>
      </Content>
      <Modal title='Add new folder' okButtonProps={
        { disabled: validateSaveButton() }} visible={isModalVisible} okText="SAVE" cancelText="CANCLE" onOk={handleOk} onCancel={handleCancel} >
        <Form
          layout='vertical'
        >
          <Form.Item label='Title:'>
            <Input name="title" value={newFolder.title} onChange={handleOnChangeNewFolder} ></Input>
          </Form.Item>
          <Form.Item label='Visible:' >
            <Select
              name='visibleTypes'
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
              optionFilterProp="children"
              onChange={(value) =>
                setNewFolder({
                  ...newFolder,
                  visible: value
                })
              }
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              value={newFolder.visible}
            >
              {Object.values(visibleTypes).map(currentData => <Select.Option key={currentData.key} value={currentData.key}>{currentData.title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label='Select specific users:'>
            <Select
              mode="multiple"
              allowClear
              disabled={newFolder.visible !== visibleTypes.specificUser.key}
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
              optionFilterProp="children"
              onChange={(value) => {
                console.log(value)
                setNewFolder({
                  ...newFolder,
                  visibleUsers: value
                })
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
              value={newFolder.visibleUsers}
              defaultValue={[]}
            >
              {users.map(currentData => <Select.Option key={currentData.key} value={currentData.key}>{currentData.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Modal >
  );
}

export default App;
