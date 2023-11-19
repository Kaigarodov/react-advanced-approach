"use client"

import styles from './page.module.css'
import React, { FC, FunctionComponent, ReactNode, useContext, useState } from 'react';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <p style={{ color: 'pink' }}>Авторизация и не авторизация (Пример с хуком)</p>
        <WithAuthorizedExample />
      </div>
      <div>
        <p style={{ color: 'pink' }}>Render props example</p>
        <LayoutCustom />
      </div>
      <div>
        <p style={{ color: 'pink' }}>Computed component example</p>
        <ToggleCustom />
      </div>
      <div>
        <p style={{ color: 'pink' }}>Computed component example</p>
        <MenuCustom />
      </div>
      <div style={{ width: "100%", border: '3px solid pink', padding: "20px" }}>
        <div style={{ color: 'pink', padding: "20px" }}>
          Оптимизация <br />
          State location
        </div>
        <div style={{ maxHeight: '450px', overflow: "auto", }}>
          <div style={{ width: '50%', display: "inline-block" }}>
            без оптимизации state location
            <SlowRerenderComponent />
          </div>
          <div style={{ width: '50%', display: "inline-block" }}>
            c оптимизации state location
            <FastRenderComponent />
          </div>
        </div>
      </div>

      <div style={{ width: "100%", border: '3px solid pink', padding: "20px" }}>
        <div style={{ color: 'pink', padding: "20px" }}>
          Оптимизация <br />
          React.memo
        </div>
        <div style={{ maxHeight: '450px', overflow: "auto", }}>
          <div style={{ width: '50%', display: "inline-block" }}>
            без оптимизации
          </div>
          <div style={{ width: '50%', display: "inline-block" }}>
            c оптимизации
          </div>
        </div>
      </div>

      <div style={{ width: "100%", border: '3px solid pink', padding: "20px" }}>
        <div style={{ color: 'pink', padding: "20px" }}>
          Оптимизация <br />
          Condition rendering
        </div>
        <div style={{ maxHeight: '450px', overflow: "auto", }}>
          <div style={{ width: '50%', display: "inline-block" }}>
            без оптимизации
          </div>
          <div style={{ width: '50%', display: "inline-block" }}>
            c оптимизации
          </div>
        </div>
      </div>

      <div style={{ width: "100%", border: '3px solid pink', padding: "20px" }}>
        <div style={{ color: 'pink', padding: "20px" }}>
          Оптимизация <br />
          lazy loading
        </div>
        <div style={{ maxHeight: '450px', overflow: "auto", }}>
          <div style={{ width: '50%', display: "inline-block" }}>
            без оптимизации
          </div>
          <div style={{ width: '50%', display: "inline-block" }}>
            c оптимизации
          </div>
        </div>
      </div>

    </main >
  )
}

//-----------------------------------------------------------------------------------------------------------------------------
//TOGGLE Component Computed
const ToggleContext = React.createContext<{ isOn: boolean, setIsOn: React.Dispatch<React.SetStateAction<boolean>> }>(
  {
    isOn: false,
    setIsOn: () => { }
  }
);

const ToggleCompound: FunctionComponent<{ initialValue: boolean, children: React.ReactNode }> &
{
  isOn: FunctionComponent,
  isOff: FunctionComponent,
  switchButton: FunctionComponent
} = ({ children, initialValue }) => {
  const [isOn, setIsOn] = useState(initialValue)
  return <ToggleContext.Provider value={{ isOn, setIsOn }}>{children}</ToggleContext.Provider>
}

ToggleCompound.isOn = function TextOn() {
  const { isOn } = useContext(ToggleContext);
  if (!isOn) {
    return null;
  }

  return <div>on</div>
}

ToggleCompound.isOff = function TextOn() {
  const { isOn } = useContext(ToggleContext);
  if (isOn) {
    return null;
  }

  return <div>off</div>
}

ToggleCompound.switchButton = function SwitchButton() {
  const { setIsOn } = useContext(ToggleContext);

  return <button onClick={() => setIsOn(isOn => !isOn)}>switch</button>
}

const ToggleCustom: FunctionComponent = ({ }) => {
  return (
    <ToggleCompound initialValue={false}>
      <ToggleCompound.switchButton />
      <ToggleCompound.isOff />
      <ToggleCompound.isOn />
    </ToggleCompound>
  );
};



//MENU Component Computed
const MenuContext = React.createContext<{
  setActiveGroup: React.Dispatch<React.SetStateAction<string>>,
  activeGroup: string
}>({ activeGroup: '', setActiveGroup: () => { } });

const Menu: FC<{ children: React.ReactNode, title: string, initialTitle: string }> &
{
  Group: FC<{ children: React.ReactNode, title: string }>
  Item: FC<{ value: string }>
} = ({ children, title, initialTitle }) => {
  const [activeGroup, setActiveGroup] = useState(initialTitle);

  return (
    <MenuContext.Provider value={{ activeGroup, setActiveGroup }}>
      <h3>{title}</h3>
      {children}
    </MenuContext.Provider>
  )
}
Menu.Group = function MenuGroup({ children, title }) {
  const context = useContext(MenuContext);

  return <div>
    <button onClick={() => { context.setActiveGroup(title) }}>{title}</button>
    {context.activeGroup === title && <div>{children}</div>}
  </div>
}

Menu.Item = function MenuItem({ value }) {
  return <div>{value}</div>
}

const MenuCustom = () => {
  return (
    <Menu title="Менюшечка" initialTitle="заголовок 1">
      <Menu.Group title='заголовок 1'>
        <Menu.Item value='элемент'></Menu.Item>
        <Menu.Item value='элемент'></Menu.Item>
        <Menu.Item value='элемент'></Menu.Item>
      </Menu.Group>
      <Menu.Group title='заголовок 2'>
        <Menu.Item value='элемент'></Menu.Item>
        <Menu.Item value='элемент'></Menu.Item>
        <Menu.Item value='элемент'></Menu.Item>
      </Menu.Group>
      <Menu.Group title='заголовок 3'>
        <Menu.Item value='элемент'></Menu.Item>
        <Menu.Item value='элемент'></Menu.Item>
        <Menu.Item value='элемент'></Menu.Item>
      </Menu.Group>
    </Menu>)
}

//-----------------------------------------------------------------------------------------------------------------------------
//Layout, render props
const Layout: FC<{
  renderHeader: () => React.ReactNode,
  renderAside: () => React.ReactNode,
  renderContent: (isOpen: boolean) => React.ReactNode,
  renderFooter: () => React.ReactNode,
  children?: React.ReactNode
}> = ({
  renderHeader,
  renderAside,
  renderContent,
  renderFooter,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
      <header>{renderHeader()}</header>
      <main>
        Меняем состояние из родителя, обрабатываем в рендер пропе:<button onClick={() => { setIsOpen(!isOpen) }}>click</button>
        <section>{renderContent(isOpen)}</section>
        <aside>{renderAside()}</aside>
      </main>
      <footer>
        {renderFooter()}
      </footer>
    </div>
  }

const LayoutCustom = () => {
  return (
    <Layout
      renderHeader={() => <div>header header header</div>}
      renderAside={() => <div>aside</div>}
      renderContent={(isOpen: boolean) => <div>content isOpen {String(isOpen)}</div>}
      renderFooter={() => <div>footer footer footer</div>}
    >
    </Layout>
  )
}

//-----------------------------------------------------------------------------------------------------------------------------
//HOC
const AuthorizedContext = React.createContext(false);
const useAuthorized = () => {
  const authorized = useContext(AuthorizedContext);
  return authorized
}

// Компоненты, для рендера
//------------------------
const AuthorizedComponent = () => {
  return <div>Пользователь авторизован</div>
}
const UnauthorizedComponent = () => {
  return <div>Пользователь не авторизован</div>
}
//------------------------

// Использование хука
//------------------------
const withAuthorizedHoc = ({ Authorized, Unauthorized }: { Authorized: () => React.JSX.Element, Unauthorized: () => React.JSX.Element }) => {
  return function Hoc() {
    const authorized = useAuthorized();
    return authorized ? <Authorized /> : <Unauthorized />
  }
}
const CustomComponent = withAuthorizedHoc({
  Authorized: AuthorizedComponent,
  Unauthorized: UnauthorizedComponent
});
//------------------------

// Пример с контекстом авторизации и использование компоненты из Хока
//------------------------
const WithAuthorizedExample = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  return <AuthorizedContext.Provider value={isAuthorized}>
    <button onClick={() => setIsAuthorized(!isAuthorized)}>{isAuthorized ? "auth" : "unauth"}</button>
    <CustomComponent />
  </AuthorizedContext.Provider >
}
//------------------------



//-----------------------------------------------------------------------------------------------------------------------------
//Оптимизация
//State location
const useVerySlowHook = () => {
  let startTime = performance.now();
  while (performance.now() - startTime < 3) {
    //do nothing 2ms per item for emulate slow operation
  }
}

const SomeBigComponent = () => {
  return Array(100).fill(null).map((item, index) => <Item key={index}>Элемент {index}</Item>)
}

const Item = ({ children }) => {
  useVerySlowHook();
  return <div>{children}</div>
}


const SlowRerenderComponent = () => {
  const [counter, updateCounter] = useState(0);
  return <div>
    <button onClick={() => { updateCounter(counter => counter + 1) }}>update Counter</button>
    <p>counter: {counter}</p>
    <SomeBigComponent />
  </div>
}

//оптимизированный вариант (выносим count с состоянием в отдельную функцию)
const SomeCounterForFastRender = () => {
  const [counter, updateCounter] = useState(0);
  return <div>
    <button onClick={() => { updateCounter(counter => counter + 1) }}>update Counter</button>
    <p>counter: {counter}</p>
  </div>
}
const FastRenderComponent = () => {
  return <>
    <SomeCounterForFastRender />
    <SomeBigComponent />
  </>
}

//Оптимизация
//Conditional render
