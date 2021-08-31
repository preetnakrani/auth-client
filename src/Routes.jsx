import React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { PageHeader, Button } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import { getTokenData, setAccessToken } from "./auth";
import api from "./apis/apis-v1";

import { ProtectedRoute } from "./common-components/routing/protectedrouting/protected-route";
import { ReverseProtectedRoute } from "./common-components/routing/reverseprotectedrouting/reverse-protected-route";

import { Signup } from "./routes/signup/signup";
import { Login } from "./routes/login/login";
import { Forgot } from "./routes/forgotpassword/forgot";
import { Resend } from "./routes/resend-verification/resend";
import { UpdatePassword } from "./routes/updatePassword/updatePassword";

import "./Routes.css";

export const Routes = (props) => {
  const history = useHistory();
  const location = useLocation();
  const username = getTokenData().username || "";
  if (props.auth && username === "") {
    props.setAuth(false);
  }
  const clickHome = () => {
    history.push("/");
  };

  const extra = !props.auth
    ? [
        <div className={"nav-bar-button"} key={"4"}>
          <Button
            onClick={() => {
              history.push("/login");
            }}
            type={"primary"}
          >
            Login
          </Button>
        </div>,
        <div className="nav-bar-button" key={"3"}>
          <Button
            onClick={() => {
              history.push("/signup");
            }}
            type={"primary"}
          >
            SignUp
          </Button>
        </div>,
      ]
    : [
        <div className="nav-bar-button" key={"2"}>
          <Button
            onClick={() => {
              history.push("/");
            }}
            icon={<UserOutlined />}
            type="primary"
          >
            {username}
          </Button>
        </div>,
        <div className="nav-bar-button" key={"1"}>
          <Button
            type="primary"
            onClick={async () => {
              await api.post("/logout");
              setAccessToken("");
              props.setAuth(false);
              history.push("/");
            }}
            style={{ width: "auto" }}
          >
            Logout
          </Button>
        </div>,
      ];

  const pageHeader = (
    <PageHeader
      className="nav-bar"
      title={
        location.pathname === "/" ? (
          <DollarOutlined className="dollar" />
        ) : (
          <ArrowLeftOutlined onClick={() => history.goBack()} />
        )
      }
      subTitle={
        <div onClick={clickHome} className={"home"}>
          Project
        </div>
      }
      extra={extra}
    />
  );
  return (
    <div>
      {pageHeader}
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login">
          <Login setAuth={props.setAuth} />
        </Route>
        <Route exact path="/forgot" component={Forgot} />
        <Route exact path="/resend" component={Resend} />
        <ProtectedRoute
          exact
          path="/protected"
          component={() => {
            return <div>This route is mega protected son!</div>;
          }}
        />
        <ReverseProtectedRoute
          exact
          path="/unprotected"
          component={() => {
            return <div>This route is unprotected!</div>;
          }}
        />
        <Route
          exact
          path="/unauth"
          render={() => <div>You shall not pass</div>}
        />
        <Route
          exact
          path="/update/password/:id/:token"
          component={UpdatePassword}
        />
        <Route
          path="*"
          render={() => <div>This route does not exist mate!</div>}
        />
      </Switch>
    </div>
  );
};

Routes.propTypes = {
  auth: PropTypes.bool.isRequired,
  setAuth: PropTypes.func.isRequired,
};

const Home = () => {
  return (
    <div>
      <div>Authication Starter!!!</div>
      <div>
        Try to signup, login, reset password, get reset link, confirm email!
      </div>
    </div>
  );
};
