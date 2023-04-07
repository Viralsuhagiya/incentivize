import { Amplify } from '@aws-amplify/core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Route } from 'react-router';
import NoCompany from './auth/NoCompany';
import SignupAcceptInvite from './auth/SignupAcceptInvite';
import SignupVerifyEmailPhoneNumber from './auth/SignupVerifyEmailPhoneNumber';
import { authProvider, dataProvider } from './authProviderOdoo';
import awsExports from './aws-exports';
import { Dashboard } from './dashboard';
import englishMessages from './i18n/en';
import { Layout, Login, LoginWithoutPassword } from './layout';
import AddTimePage from './layout/AddTimePage';
import PropayInformation from './layout/PropayInformation';
import attendance from './resources/attendances';
import SettingTabs from './resources/companies/SettingTabs';
import company from './resources/company';
import employees from './resources/employees';
import JobReportList from './resources/jobs/job';
import CompanyOnboard from './resources/onboard/CompanyOnboard';
import payrolls from './resources/payrolls';
import Policies from './resources/policies/Policies';
import propays from './resources/propays';
import EditPropayTab from './resources/propays/EditPropayTab';
import PropayCreateTab from './resources/propays/PropayCreateTab';
import PropayDetailsTab from './resources/propays/PropayDetailsTab';
import PayrollTabs from './resources/propays/PropayTabs';
import simple from './resources/related';
import { BonusOtReportList } from './resources/reports/BonusOtReportList';
import { PropayBonusList } from './resources/reports/PropayBonus';
import { ProPayDetailReportList } from './resources/reports/ProPayDetailReport';
import { ProPayEfficiencyReportList } from './resources/reports/proPayEfficiencyReport';
import { PropayStatusReportList } from './resources/reports/PropayStatusReport';
import { WageGrowthReportList } from './resources/reports/WageGrowthReport';
import themeReducer from './themeReducer';

Amplify.configure(awsExports);

const i18nProvider = polyglotI18nProvider(locale => {
    if (locale === 'es') {
        return import('./i18n/es').then(messages => messages.default);
    }

    // Always fallback on english
    return englishMessages;
}, 'en');
const App = () => {

    //disabling zoom because its causing problem in userflow
    //seems like zoom approach is fundamentaly wrong.

    // useEffect(() => {
    //     const initialValue = (document.body.style as any).zoom;
    
    //     // Change zoom level on mount
    //     (document.body.style as any).zoom = "90%";

    //     // (document.getElementById("root") as any).style.transform = "scale(0.9)";
    //     // (document.getElementById("root") as any).style.transformOrigin = "0 0";
    
    //     return () => {
    //       // Restore default value
    //         (document.body.style as any).zoom = initialValue;
    //     };
    // }, []);

    return (
        <Admin
            title=""
            authProvider={authProvider}
            dataProvider={dataProvider}
            customReducers={{ theme: themeReducer }}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
        >
            <Resource name="employees" {...employees} />
            <Resource name="propays" {...propays} />
            <Resource name="payrolls" {...payrolls}/>
            <Resource name="periods" {...simple} />
            <Resource name="shift" {...simple} />
            <Resource name="taskLists" {...simple} />
            <Resource name="positions" {...simple} />
            <Resource name="companies" {...company} />
            <Resource name="attendances" {...attendance}/>
            <Resource name="customFields" />
            <Resource name="tsheetConnectors" />
            <Resource name="salesForceBackends" />
            <Resource name="vericlockBackends" />
            <Resource name="users" {...simple} />
            <Resource name="taxTypes" {...simple} />
            <Resource name="partners" {...simple} />
            <CustomRoutes>
                <Route
                    path="/jobs/*"
                    element={<JobReportList />}
                />
                <Route
                    path="/reports/wage-growth-report"
                    element={<WageGrowthReportList />}
                />
                <Route
                    path="/reports/propay-status-report"
                    element={<PropayStatusReportList />}
                />
                <Route
                    path="/reports/propay-detail-report"
                    element={<ProPayDetailReportList />}
                />
                <Route
                    path="/reports/bonus-ot-report"
                    element={<BonusOtReportList />}
                />
                <Route
                    path="/reports/propay-bonus-report"
                    element={<PropayBonusList />}
                />
                <Route
                    path="/reports/propay-efficiency-report"
                    element={<ProPayEfficiencyReportList />}
                />
                <Route path="/setting" element={<SettingTabs />} >
                    <Route path="/setting/tsheet" element={<SettingTabs value="tsheet" />} />
                    <Route path="/setting/zapier" element={<SettingTabs value="zapier" />} />
                    <Route path="/setting/dataverse" element={<SettingTabs value="dataverse" />} />
                    <Route path="/setting/salesforce" element={<SettingTabs value="salesforce" />} />
                    <Route path="/setting/vericlock" element={<SettingTabs value="vericlock" />} />
                    <Route path="/setting/notifications" element={<SettingTabs value="notifications" />} />
                </Route>
                <Route path="/create/propay" element={<PropayCreateTab/>} />
            </CustomRoutes>
            <CustomRoutes noLayout>
                <Route path="/reset_password" element={<SignupAcceptInvite signup_type="reset"/>} />
                <Route path="/accept-invite" element={<SignupAcceptInvite signup_type="signup"/>} />
                <Route path="/verify" element={<SignupVerifyEmailPhoneNumber />} />
                <Route
                    path="/login-without-password"
                    element={<LoginWithoutPassword />}
                />
                <Route path="/no-company" element={<NoCompany />} />
                <Route path="/onboard/*" element={<CompanyOnboard />} />

            </CustomRoutes>
            <CustomRoutes noLayout>
                <Route path="/propay/*" element={<PayrollTabs  />} />
                
                <Route
                    path="/how-propay-works"
                    element={<PropayInformation />}
                />
            </CustomRoutes>
            <CustomRoutes noLayout>
                <Route path="/policies/*" element={<Policies  />} />
            </CustomRoutes>
            <CustomRoutes>
            <Route path="/edit/:id/propay" element={<EditPropayTab/>} />
            {/* <Route path="/addtime" element={<AddTimePage />} /> */}
            <Route path="/show/:id/propay" element={<PropayDetailsTab/>} />
            </CustomRoutes>
        </Admin>
    );
};

export default App;
