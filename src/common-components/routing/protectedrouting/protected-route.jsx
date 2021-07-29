import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";

import { Modal } from "antd";
import { SyncOutlined } from "@ant-design/icons";

import { currAuth, isAuth } from "../../../auth";

import "./protected-route.css";

export const ProtectedRoute = ({ component: Component, props, ...rest }) => {
  const [auth, setAuth] = useState(currAuth());
  const [loading, setLoading] = useState(!auth);
  useEffect(() => {
    const stuff = async () => {
      let [valid] = await isAuth();
      setAuth(valid);
      setLoading(false);
    };
    if (!auth) {
      setLoading(true);
      stuff();
    }
  }, [auth]);
  return (
    <Route
      {...rest}
      render={() => {
        if (auth) {
          return <Component {...props} />;
        } else if (loading) {
          return (
            <Modal visible={true} closable={false} title={"Loading!!!"}>
              <SyncOutlined
                className={"spinner"}
                spin={true}
                style={{ fontSize: "30px" }}
              />
            </Modal>
          );
        } else {
          return <Redirect to="/unauth" />;
        }
      }}
    />
  );
};
