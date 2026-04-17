import { App as AntdApp, ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { router } from './providers/router'
import { store } from './store'
import { appTheme } from './styles/theme'

export function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={ruRU} theme={appTheme}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </Provider>
  )
}
