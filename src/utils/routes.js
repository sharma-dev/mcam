import {
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Home from "../modules/Home";
import AuthMiddleware from "./middleware/auth";
import LoginScreen from "../modules/Login";
import RegisterScreen from "../modules/Register";
import SideBar from '../shared/Sidebar';
import Trips from "../modules/Trips"; // trips is used for groups page
import ManageTrip from "../modules/ManageGroups";
import SettingModule from "../modules/Settings";

const headerMode = {
    headerMode: "none",
    navigationOptions: {
        headerVisible: false
    }
};


const AuthStackRoutes = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen
}, headerMode);

const MainStack = createStackNavigator({
    Home: Home,
    Trips: Trips,
    ManageTrip: ManageTrip,
    Settings: SettingModule
}, headerMode)

// const AppNavigator = createDrawerNavigator({ //side bar disabled
//     MainStack: mainStack
// }, Object.assign({contentComponent: props => <SideBar {...props}/>},headerMode));

const AppContainer = createAppContainer(createSwitchNavigator(
    {   
        AuthMiddleware: AuthMiddleware,
        Auth: AuthStackRoutes,
        App: MainStack
    },
    {
        initialRouteName: 'AuthMiddleware'
    }
));


export default AppContainer;