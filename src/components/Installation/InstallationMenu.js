import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Menu, Row } from 'antd';

const InstallationMenu = (props) => {
  const { children, counts, match } = props;

  return (
    <div style={{ background: 'white' }}>
      <Row type="flex" justify="start">
        <Menu
          style={{ width: 256 }}
          defaultSelectedKeys={[match.params.section || 'details']}
          mode="inline"
        >
          <Menu.Item key="details">
            <NavLink to={`/installation/${match.params.key}`}>Overview</NavLink>
          </Menu.Item>
          <Menu.Item key="contact">
            <NavLink to={`/installation/${match.params.key}/contact`}>Contacts ({counts.contacts})</NavLink>
          </Menu.Item>
          <Menu.Item key="endpoint">
            <NavLink to={`/installation/${match.params.key}/endpoint`}>Endpoints ({counts.endpoints})</NavLink>
          </Menu.Item>
          <Menu.Item key="identifier">
            <NavLink to={`/installation/${match.params.key}/identifier`}>Identifiers ({counts.identifiers})</NavLink>
          </Menu.Item>
          <Menu.Item key="tag">
            <NavLink to={`/installation/${match.params.key}/tag`}>Tags ({counts.tags})</NavLink>
          </Menu.Item>
          <Menu.Item key="machineTag">
            <NavLink to={`/installation/${match.params.key}/machineTag`}>Machine Tags ({counts.machineTags})</NavLink>
          </Menu.Item>
          <Menu.Item key="comment">
            <NavLink to={`/installation/${match.params.key}/comment`}>Comments ({counts.comments})</NavLink>
          </Menu.Item>
        </Menu>
        <div style={{ padding: 16, width: 'calc(100% - 256px)' }}>
          {children}
        </div>
      </Row>
    </div>
  );
};

export default withRouter(InstallationMenu);