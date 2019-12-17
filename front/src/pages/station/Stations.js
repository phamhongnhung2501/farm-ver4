import React from "react";

import {
    CardBody, Card,
    Row, Col,
    Container,
    Button,
    ModalHeader,ModalFooter,Modal,ModalBody,
    FormGroup,FormFeedback,Input,
    Label,
    DropdownMenu, DropdownToggle, DropdownItem, UncontrolledDropdown, 
    Collapse, Nav, Navbar,
} from "reactstrap";
import {
    Tabs, Tab
  } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import {CustomImg} from "../../components/CustomTag";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import empty_avatar from "../../assets/img/avatars/empty_avatar.png";
import {Settings} from "react-feather";
import {Link} from "react-router-dom";
import TableProject from "./StationsTable";
import Notification from "../../components/Notification";
import Maps from "./Maps";
const api = require("./api/api");
const utils = require("../../utils/utils");
const ValidInput = require("../../utils/ValidInput");


class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.state = {
          selectedDay: undefined,
        };
      }
    
      handleDayChange(day) {
        this.setState({ selectedDay: day });
        this.props.handleDate(day)
      }
    
      render() {
        const { selectedDay } = this.state;

        return (
          <div>
            {selectedDay && <p>Ngày: {selectedDay.toLocaleDateString()}</p>}
            {!selectedDay && <p>Ngày bắt đầu: </p>}
            <DayPickerInput onDayChange={this.handleDayChange} />
          </div>
        );
      }
}
class Project extends React.Component {
    constructor(props) {
        super(props);
        const { seed } = this.props;
        const {sub_id} = this.props;
        this.state = {
            data: [],
            // data2: {
            //      stage_1: {},
            //     stage_2: {},
            //     stage_3: {},
            //     stage_4: {},
            // },
            dataConfig: {
                stage_1: {},
                stage_2: {},
                stage_3: {},
                stage_4: {},
            },
            latitude: "20.908197",
            longitude: "105.721588",
            showModal: {
                create_project: false,
                config_digital: false
            },
            temp: {
                name: "",
                sub_id: "",
                // owner_id: null,
                seed: {

                },
                stage_1: {},
                stage_2: {},
                stage_3: {},
                stage_4: {},
                started_plant: Date.now(),
               
            },
            listGateWay: [],
            listSeed: [
            ],
            submitted: false,
            isLoaderAPI: false,
            keyWord: null,
            type: "list"
        };
        this.handleConfig = this.handleConfig.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCloseConfig = this.handleCloseConfig.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCreateProject = this.handleChangeCreateProject.bind(this);
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
        this.changeSearchChars = this.changeSearchChars.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    handleDate(date){
        this.setState(prevState => ({
            temp: {
                ...prevState.temp,
                started_plant: date,
            }
        }))
    }
    componentDidMount() {
        const that = this;
        api.getInfoProjectAll((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message
                );
            } else {

                that.setState({ data: result, isLoaderAPI: true });
            }
        });
        api.getListSeed((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({ listSeed: result });
            }
        });
        api.getListGateWay((err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                that.setState({ listGateWay: result });
            }
        });
        
    }

    // --------------------function for config digital-----------------


    handleSaveChange(event) {
        let temp = Object.assign({}, this.state.temp, this.state.temp.stage_1, this.state.temp.stage_2, this.state.temp.stage_3, this.state.temp.stage_4, this.state.temp.seed);
        console.log(temp);
        console.log(temp.seed);
        
        let obj = event.target.name.split(".")[0]
        let key = event.target.name.split(".")[1]
        
        
        if(obj === 'stage_1')
            temp.stage_1[key] = event.target.value;
        else if(obj === 'seed')
        temp.seed[key] = event.target.value;
        else if(obj === 'stage_2')
            temp.stage_2[key] = event.target.value;
        else if(obj === 'stage_3')
            temp.stage_3[key] = event.target.value;
        else if(obj === 'stage_4')
            temp.stage_4[key] = event.target.value;
        else
            temp[event.target.name] = event.target.value;
        this.setState({ 'temp': temp });

        api.modifyStation(temp.seed._id, this.state.dataConfig, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.status + ' ' + err.data._error_message)
            } else {
                // --------sau khi thay doi va update ok
                console.log(result);
                this.state.dataConfig.push(result);
                localStorage.setItem('project', JSON.stringify(result));
                Notification("success", "Edit Station", "Edit station is successfully");
            }
        })
       
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    // ----------------------------------------------------------------
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state === nextState) {
            return false;
        }
        return true;
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.temp, this.state.temp.stage_1, this.state.temp.stage_2, this.state.temp.stage_3, this.state.temp.stage_4, this.state.temp.seed);
        console.log(temp);
        console.log(temp.seed);
        
        let obj = event.target.name.split(".")[0]
        let key = event.target.name.split(".")[1]
        
        
        if(obj === 'stage_1')
            temp.stage_1[key] = event.target.value;
        else if(obj === 'seed')
        temp.seed[key] = event.target.value;
        else if(obj === 'stage_2')
            temp.stage_2[key] = event.target.value;
        else if(obj === 'stage_3')
            temp.stage_3[key] = event.target.value;
        else if(obj === 'stage_4')
            temp.stage_4[key] = event.target.value;
        else
            temp[event.target.name] = event.target.value;
        console.log(event.target.name, event.target.value);
        
        this.setState({ 'temp': temp });

        api.getConfig( temp.seed._id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                
                console.log(result);
                this.setState({
                    dataConfig: result
                })
                localStorage.setItem('project', JSON.stringify(result));
            }
        });
       
    }
    handleChangeCreateProject(event) {
        let temp = Object.assign({}, this.state.temp, this.state.temp.stage_1, this.state.temp.stage_2, this.state.temp.stage_3, this.state.temp.stage_4, this.state.temp.seed);
        console.log(temp);
        console.log(temp.seed);
        
        let obj = event.target.name.split(".")[0]
        let key = event.target.name.split(".")[1]
        
        
        if(obj === 'stage_1')
            temp.stage_1[key] = event.target.value;
        else if(obj === 'seed')
        temp.seed[key] = event.target.value;
        else if(obj === 'stage_2')
            temp.stage_2[key] = event.target.value;
        else if(obj === 'stage_3')
            temp.stage_3[key] = event.target.value;
        else if(obj === 'stage_4')
            temp.stage_4[key] = event.target.value;
        else
            temp[event.target.name] = event.target.value;
        this.setState({ 'temp': temp });

        
    }

    handleShow() {
        let state = Object.assign({}, this.state);
        state.showModal.create_project = true;
        this.setState(state);
    }
    handleConfig() {
        let state = Object.assign({}, this.state);
        state.showModal.config_digital = true;
        this.setState(state);
    }

    handleClose() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.is_private = false;
        state.showModal.create_project = false;
        this.setState(state);
    }

    handleCloseConfig() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.is_private = false;
        state.showModal.config_digital = false;
        this.setState(state);
    }

    handleSearch(event) {
        this.changeSearchChars(event.target.value);
    }

    changeSearchChars(chars) {
        let state = Object.assign({}, this.state);
        state.keyWord = chars;
        this.setState(state);
    }

    handleChangeType(event) {
        this.setState({
            type: event.target.value
        });
    }

    handleCreateProject() {
        const that = this;
        this.setState({ submitted: true });

        // stop here if form is invalid
        const { name } = this.state.temp;
        if (!name) {
            return;
        }
        api.createProject(this.state.temp, (err, result) => {
            console.log(this.state.temp);
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message
                );
            } else {
                this.state.data.push(result);
                Notification("success");
                this.handleClose();
            }
        });
    }

    render() {
        const { seed, sub_id} = this.state;
        const { dispatch } = this.props;
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const avatar = userInfo.photo;
        const name = userInfo.full_name;
        const isAdmin = userInfo.is_admin;
        // console.log(this.state.dataConfig.stage_1.stage_days);
        return (
            <React.Fragment>         
                <Modal 
                    size="md"
                    isOpen={this.state.showModal.create_project}
                    className="modal-project"
                >                     
                        <ModalHeader >
                                Tạo vườn ươm mới
                        </ModalHeader>                   
                    <ModalBody>
                        <FormGroup >
                            <Row>
                                <Col xs="6" className="pb-0 !important">
                                    <Label for="name_of_project">Tên vườn ươm</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="_ _ _ "
                                        value={this.state.temp.name}
                                        // onChange={this.handleChange}
                                        onChange={this.handleChangeCreateProject}
                                        invalid={
                                            this.state.submitted && !this.state.temp.name ? true : false
                                        }
                                    />
                                    <FormFeedback invalid>
                                        Tên vườn ươm là một trường bắt buộc!
                                    </FormFeedback>
                                   
                                </Col>
                                <Col xs="6" className="pb-0 !important">
                                <Label>Gateway</Label>
                                    <div className="station--overflow">
                                        <Input type="select" width="10px" height="3px" onChange={this.handleChangeCreateProject} name="sub_id" className="station__input-gateway">

                                            {
                                                this.state.listGateWay.map((sub_id, index) => {                         
                                                    return (
                                                        <option 
                                                            className="d-inline station__gateway " 
                                                            value={sub_id} >{sub_id}
                                                        </option>
                                                                                                    
                                                    )
                                                })
                                                
                                            }
                                        </Input>
                                    </div>
                                </Col>
                            </Row>
                            
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col xs="6">
                                    <Label>Giống cây trồng</Label>
                                    <Input type="select" width="10px" onChange={this.handleChangeCreateProject} name="seed._id" id="createProject">
                                        {
                                            this.state.listSeed.map((seed, index) => {                                   
                                                return (
                                                    <option className="d-inline" value={seed._id}>
                                                        {
                                                        seed.seed === "tomato" ? "Cà chua" : ""||
                                                        seed.seed === "cucumber" ? "Dưa chuột" : ""||
                                                        seed.seed === "pakchoi" ? "Cải ngọt" : ""||
                                                        seed.seed === "brassica" ? "Cải chíp" : ""||
                                                        seed.seed === "cabbage" ? "Bắp cải" : ""
                                                        }
                                                    </option>
                                                                                                
                                                )
                                            })
                                            
                                        }                                       
                                    </Input>
                                </Col>
                                <Col xs="6">
                                    <DateTimePicker handleDate={this.handleDate} />
                                </Col>
                            </Row>
                        </FormGroup>
                        
                    </ModalBody>
                    <ModalFooter className="mt-3">
                        <Button className="station__button-back" onClick={this.handleClose.bind(this)}>
                            Quay lại
                        </Button>
                        <Button
                            className="station__button-create"
                            onClick={this.handleCreateProject.bind(this)}
                        >
                            Tạo vườn ươm mới
                        </Button>
                        
                    </ModalFooter>
                </Modal>

                <Modal 
                    size="md"
                    isOpen={this.state.showModal.config_digital}
                >                     
                        <ModalHeader >
                                Cài đặt thông số của cây trồng
                        </ModalHeader>                   
                    <ModalBody>
                    <Row>
                        <Col xs="4">
                            <Label>Chọn cây trồng</Label>
                            <Input type="select" width="10px" onChange={this.handleChange} name="seed._id" id="createConfig">
                                {
                                    this.state.listSeed.map((seed, index) => { 
                                        // console.log(seed)                                  
                                        return (
                                            <option className="d-inline" value={seed._id}>
                                                {
                                                seed.seed === "tomato" ? "Cà chua" : ""||
                                                seed.seed === "cucumber" ? "Dưa chuột" : ""||
                                                seed.seed === "pakchoi" ? "Cải ngọt" : ""||
                                                seed.seed === "brassica" ? "Cải chíp" : ""||
                                                seed.seed === "cabbage" ? "Bắp cải" : ""
                                                }
                                            </option>
                                                                                        
                                        )
                                    })                        
                                }                                       
                            </Input>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="mt-3">
                        <Tabs defaultActiveKey="g1" >
                            <Tab eventKey="g1" title="Ươm hạt " >
                                <Card className="flex-fill w-100" style={{ height: 400, width: "100%" }}>
                                <CardBody className="my-0">
                                    <Row>
                                        <Col xs="4" > 
                                            Tổng số ngày : 
                                        </Col>
                                        <Col xs="4" className="text-center station__stage-date"> 
                                            <Input
                                                type="number" name="stage_1.stage_days"
                                                placeholder="Tổng số ngày"
                                                defaultValue={this.state.dataConfig.stage_1.stage_days}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Nhiệt độ : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_1.min_temp"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_1.min_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_1.max_temp"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_1.max_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm không khí : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_1.min_hum"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_1.min_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_1.max_hum"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_1.max_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm đất : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_1.min_soil_moisture"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_1.min_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_1.max_soil_moisture"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_1.max_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Ánh sáng : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_1.min_light"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_1.min_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_1.stage_1max_light"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_1.max_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            PH : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_1.min_PH"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_1.min_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            /> 
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_1.max_PH"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_1.max_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                                </Card>
                            </Tab>
                            <Tab eventKey="g2" title="Ra hoa" >
                                <Card className="flex-fill w-100" style={{ height: 400, width: "100%" }}>
                                <CardBody className="my-0">
                                    <Row>
                                        <Col xs="4" > 
                                            Tổng số ngày : 
                                        </Col>
                                        <Col xs="4" className="text-center station__stage-date"> 
                                            <Input
                                                type="number" name="stage_2.stage_days"
                                                placeholder="Tổng số ngày"
                                                defaultValue={this.state.dataConfig.stage_2.stage_days}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Nhiệt độ : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_2.min_temp"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_2.min_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_2.max_temp"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_2.max_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm không khí : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_2.min_hum"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_2.min_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_2.max_hum"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_2.max_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm đất : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_2.min_soil_moisture"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_2.min_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_2.max_soil_moisture"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_2.max_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Ánh sáng : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_2.min_light"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_2.min_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_2.stage_1max_light"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_2.max_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            PH : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_2.min_PH"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_2.min_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            /> 
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_2.max_PH"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_2.max_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                                </Card>
                            </Tab>
                            <Tab eventKey="g3" title="Ra hoa" >
                                <Card className="flex-fill w-100" style={{ height: 400, width: "100%" }}>
                                <CardBody className="my-0">
                                    <Row>
                                        <Col xs="4" > 
                                            Tổng số ngày : 
                                        </Col>
                                        <Col xs="4" className="text-center station__stage-date"> 
                                            <Input
                                                type="number" name="stage_3.stage_days"
                                                placeholder="Tổng số ngày"
                                                defaultValue={this.state.dataConfig.stage_3.stage_days}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Nhiệt độ : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_3.min_temp"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_3.min_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_3.max_temp"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_3.max_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm không khí : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_3.min_hum"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_3.min_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_3.max_hum"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_3.max_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm đất : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_3.min_soil_moisture"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_3.min_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_3.max_soil_moisture"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_3.max_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Ánh sáng : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_3.min_light"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_3.min_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_3.stage_1max_light"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_3.max_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            PH : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_3.min_PH"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_3.min_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            /> 
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_3.max_PH"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_3.max_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                                </Card>
                            </Tab>
                            <Tab eventKey="g4" title="Ra hoa" >
                                <Card className="flex-fill w-100" style={{ height: 400, width: "100%" }}>
                                <CardBody className="my-0">
                                    <Row>
                                        <Col xs="4" > 
                                            Tổng số ngày : 
                                        </Col>
                                        <Col xs="4" className="text-center station__stage-date"> 
                                            <Input
                                                type="number" name="stage_4.stage_days"
                                                placeholder="Tổng số ngày"
                                                defaultValue={this.state.dataConfig.stage_4.stage_days}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Nhiệt độ : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_4.min_temp"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_4.min_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_4.max_temp"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_4.max_temp}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm không khí : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_4.min_hum"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_4.min_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_4.max_hum"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_4.max_hum}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Độ ẩm đất : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_4.min_soil_moisture"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_4.min_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_4.max_soil_moisture"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_4.max_soil_moisture}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            Ánh sáng : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_4.min_light"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_4.min_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />  
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_4.stage_1max_light"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_4.max_light}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="4" className="mt-4">
                                            PH : 
                                        </Col>
                                        <Col xs="4" className="mt-4">
                                            <Input
                                                type="number" name="stage_4.min_PH"                                            
                                                placeholder="nhỏ nhất"
                                                defaultValue={this.state.dataConfig.stage_4.min_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            /> 
                                        </Col>
                                        <Col xs="4" className="mt-4"> 
                                            <Input
                                                type="number" name="stage_4.max_PH"                                            
                                                placeholder="lớn nhất"
                                                defaultValue={this.state.dataConfig.stage_4.max_PH}
                                                onChange={this.handleChange}
                                                autoComplete="off"
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                        </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter className="mt-3">
                        <Button className="station__button-back" onClick={this.handleCloseConfig.bind(this)}>
                            Quay lại
                        </Button>
                        <Button type="button" color="warning" onClick={this.handleSaveChange.bind(this)}>Lưu thay đổi</Button>
                        
                    </ModalFooter>
                </Modal>
              
                {/* -----------------------------AVATAR------------------------------- */}

                <Navbar className="nav__banner"  light expand>
                    {/* <CustomImg className="ml-5" src="https://www.farmpowerimplements.com/wp-content/uploads/2019/06/FPI-LOGO-BANNER-LARGE-2500x679.jpg" width="250" /> */}
                    <Collapse navbar>
                        <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar className="station_nav-info" >
                                <span className="d-inline-block d-sm-none">
                                <DropdownToggle nav caret className="float-right !important">
                                    <Settings size={18} className="align-middle" />
                                </DropdownToggle>
                            </span>
                                <span className="d-none d-sm-inline-block float-right station__nav mt-2 !important">
                                <DropdownToggle nav caret>
                                    <CustomImg
                                        src={avatar !== null ? avatar : empty_avatar}
                                        className="avatar img-fluid rounded-circle mr-1"
                                        alt="Avatar"
                                    />
                                    <span className="text-dark">{name}</span>
                                </DropdownToggle>
                            </span>
                                <DropdownMenu right className="">
                                    <Link to="">
                                        <DropdownItem>Help</DropdownItem>
                                    </Link>
                                    <Link to="/logout" className="text-dark">
                                        <DropdownItem>Sign out</DropdownItem>
                                    </Link>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>

                {/*------------------------------------------------------------------  */}
                
                <h1 className="text-center text-primary station__title m-5">DANH SÁCH CÁC VƯỜN ƯƠM</h1>
                
                <Container className="mt-2">
                    <Row>
                        <Col xs="3">
                            <Input
                                className="width-percent-40 ml-3 station--input-search-size"
                                id="inputSearch"
                                placeholder="Tìm kiếm vườn ươm"
                                onKeyUp={this.handleSearch.bind(this)}
                            />
                        </Col>
                        <Col xs="3"></Col>
                        <Col xs="3" className="pr-4">
                            {isAdmin ? (
                                <Button
                                    className="float-right mr-3 station--button-new station__config"
                                    onClick={this.handleConfig.bind(this)}
                                > 
                                    <FontAwesomeIcon icon={faPlus} width={3} height={2} /> Cài đặt thông số của cây trồng
                                </Button>
                            ) : null}
                        </Col>
                        
                        <Col xs="3" className="pr-4">
                            {isAdmin ? (
                                <Button
                                    className="float-right mr-3 station--button-new station__create-garden "
                                    onClick={this.handleShow.bind(this)}
                                > 
                                    <FontAwesomeIcon icon={faPlus} width={3} height={2} /> Tạo vườn ươm mới
                                </Button>
                            ) : null}
                        </Col>
                    </Row>
                    <Row>
                        {this.state.type === "list" ? (
                            <Col>
                                {this.state.isLoaderAPI ? (
                                    this.state.data.map(
                                        (
                                            {
                                                manager,
                                                name,
                                                seed,
                                                days,
                                                sub_id,
                                                address,
                                                seed_name,
                                                started_plant
                                            },
                                            index
                                        ) => {
                                            if (ValidInput.isEmpty(this.state.keyWord)) {
                                                return (
                                                    <TableProject
                                                        key={index}
                                                        index={index + 1}
                                                        manager={manager}
                                                        name={name}
                                                        sub_id={sub_id}
                                                        seed={seed}
                                                        days={days}
                                                        started_plant={started_plant}
                                                        address={address}
                                                        seed_name={seed_name}
                                                    />
                                                );
                                            } else {
                                                if (name.indexOf(this.state.keyWord) !== -1) {
                                                    return (
                                                        <TableProject
                                                            key={index}
                                                            index={index + 1}
                                                            manager={manager}
                                                            name={name}
                                                            sub_id={sub_id}
                                                            seed={seed}
                                                            days={days}
                                                            address={address}
                                                            seed_name={seed_name}
                                                            started_plant={started_plant}
                                                        />
                                                    );
                                                }
                                            }
                                        }
                                    )
                                ) : (
                                        <h1 className="text-center">Loading...</h1>
                                        
                                    )}
                            </Col>
                        ) : (
                                <Col>
                                    <Maps data={this.state.data} />
                                </Col>
                            )}
                    </Row>
                </Container>
                
                  
            </React.Fragment>
        );
    }
}

export default Project;
