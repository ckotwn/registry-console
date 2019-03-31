import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

// Mocks
import { mockedContext, userAdmin, userEditor } from '../../__mocks__/context.mock';
import messages from '../../../public/_translations/en';
// Components
import App from '../App';
import Network from './';
import Exception403 from '../exception/403';

// Mocking Context for subcomponents
const mockContext = jest.fn();
jest.mock('../AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));
const key = '43089d94-728d-4dbd-96fa-5b4bccb61246';
const appProps = {
  locale: {
    locale: 'en',
    messages: messages,
    antLocale: {},
    loading: false
  }
};

describe('<Network/>', () => {
  // Resetting context before every new iteration
  beforeEach(() => {
    mockContext.mockReset();

    mockContext.mockReturnValue(mockedContext);
  });

  it('should render presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/network/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Network)).toHaveLength(1);
  });

  it('should render 403 instead of Create page for an unauthorised user', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/network/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Network)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should not render Create page for an authorised user without ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userEditor
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/network/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Network)).toHaveLength(0);
    expect(wrapper.find(Exception403)).toHaveLength(1);
  });

  it('should render Create page for a user with ADMIN role', () => {
    mockContext.mockReturnValue({
      ...mockedContext,
      user: userAdmin
    });

    const wrapper = mount(
      <MemoryRouter initialEntries={['/network/create']}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Network)).toHaveLength(1);
  });

  it('should render presentation page', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[`/network/${key}`]}>
        <App {...appProps}/>
      </MemoryRouter>
    );

    expect(wrapper.find(Network)).toHaveLength(1);
  });
});