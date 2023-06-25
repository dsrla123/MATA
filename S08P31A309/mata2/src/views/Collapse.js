import React, { Component } from 'react';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';

class Collapse extends Component {
    render() {
        return (
            <div className="d-flex flex-column">
                <Button color="warning" id="toggle">
                    펼치기/접기
                </Button>
                <UncontrolledCollapse toggler="#toggle" className="m-0 p-0">
                    <Card>
                        <CardBody>
                            예시 내용
                        </CardBody>
                    </Card>
                </UncontrolledCollapse>
            </div>
        )
    }
}

export default Collapse;