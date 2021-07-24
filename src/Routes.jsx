import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { PageHeader } from "antd";
import PropTypes from "prop-types";
import { UserOutlined, DollarOutlined } from "@ant-design/icons";
import { FadingButton } from "./common-components/fading-button/FadingButton";
import "./Routes.css";
import { getTokenData } from "./auth";
import { Signup } from "./routes/signup/signup";

export const Routes = (props) => {
  const history = useHistory();
  const username = getTokenData().username || "";
  const clickHome = () => {
    history.push("/");
  };
  const extra = !props.auth
    ? [
        <div className="nav-bar-button" key={"4"}>
          <FadingButton
            display="Login"
            onClick={() => {
              history.push("/login");
            }}
          />
        </div>,
        <div className="nav-bar-button" key={"3"}>
          <FadingButton
            display="SignUp"
            onClick={() => {
              history.push("/signup");
            }}
          />
        </div>,
      ]
    : [
        <div className="nav-bar-button" key={"2"}>
          <FadingButton
            display={
              <div className="nav-bar-user">
                <UserOutlined /> <div>{username}</div>
              </div>
            }
            onClick={() => {
              history.push("/");
            }}
          />
        </div>,
        <div className="nav-bar-button" key={"1"}>
          <FadingButton
            display="Logout"
            onClick={() => {
              history.push("/logout");
            }}
          />
        </div>,
      ];
  const pageHeader = (
    <PageHeader
      className="nav-bar"
      title={<DollarOutlined onClick={clickHome} />}
      backIcon={true}
      subTitle={<div onClick={clickHome}>Project</div>}
      extra={extra}
    />
  );
  return (
    <div>
      {pageHeader}
      <Switch>
        <Route exact path="/" render={() => <div>Hleloo</div>} />
        <Route exact path="/signup" component={Signup} />
        <Route render={() => <div>This route does not exist mate!</div>} />
      </Switch>
    </div>
  );
};

Routes.propTypes = {
  auth: PropTypes.bool.isRequired,
  setAuth: PropTypes.func.isRequired,
};
