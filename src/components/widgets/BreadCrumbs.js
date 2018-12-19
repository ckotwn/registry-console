import React, { Component } from 'react';
import { Breadcrumb } from 'antd';

class BreadCrumbs extends Component {
  render() {
    const { listType, title, submenu } = this.props;

    return (
      <Breadcrumb>
        {listType && listType.map((crumb, i) => (<Breadcrumb.Item key={i}>{crumb}</Breadcrumb.Item>))}
        {title && <Breadcrumb.Item>{title}</Breadcrumb.Item>}
        {title && submenu && <Breadcrumb.Item>{submenu}</Breadcrumb.Item>}
      </Breadcrumb>
    );
  }
}

export default BreadCrumbs;