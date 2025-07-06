import React from 'react';
import { Layout as AntLayout, Menu, Typography, Avatar } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCardOutlined, 
  PlusOutlined, 
  UserOutlined,
  DashboardOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Sider, Content } = AntLayout;
const { Title } = Typography;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .ant-typography {
    margin: 0;
    color: #1890ff;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
`;

const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    background: #fff;
  }
  
  .ant-menu {
    border-right: none;
  }
`;

const StyledContent = styled(Content)`
  margin: 24px;
  background: #f0f2f5;
  border-radius: 8px;
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/credits',
      icon: <CreditCardOutlined />,
      label: 'Все кредиты',
    },
    {
      key: '/credits/new',
      icon: <PlusOutlined />,
      label: 'Новый кредит',
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <Title level={3}>
          <CreditCardOutlined style={{ marginRight: 8 }} />
          Система управления кредитами
        </Title>
        <HeaderRight>
          <UserInfo>
            <Avatar icon={<UserOutlined />} />
            <span>Администратор</span>
          </UserInfo>
        </HeaderRight>
      </StyledHeader>
      
      <AntLayout>
        <StyledSider width={250} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ marginTop: 16 }}
          />
        </StyledSider>
        
        <StyledContent>
          {children}
        </StyledContent>
      </AntLayout>
    </StyledLayout>
  );
};

export default Layout;