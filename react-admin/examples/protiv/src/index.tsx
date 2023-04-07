/** @jsxRuntime classic */
import { Authenticator } from '@aws-amplify/ui-react';
import { Bugfender } from '@bugfender/sdk';
import 'proxy-polyfill';
import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
// IE11 needs "jsxRuntime classic" for this initial file which means that "React" needs to be in scope
// https://github.com/facebook/create-react-app/issues/9906
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { ProgressBarStyle } from './components/LoadingScreen';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
import GlobalStyles from './theme/globalStyles';
import Zendesk from './ZendexConfig';

const REACT_APP_AMPLIFY_ENV = {
	dev:'LfgJKs8Ahhp0MZdlxBMn1BjgR5RbHdvM',
	prod:'P5QVy1slEYiS8demmDtB49D0L1ESqPmZ',
	testkiwi:'fMmKZxNW8RP6SFGVe8cT1nY8Pgw5hlTD'
}

const ZENDESK_KEYS = {
	dev:'0f008ad7-6dfe-4807-b7ce-3ab79b5887c3',
	testauth:'0f008ad7-6dfe-4807-b7ce-3ab79b5887c3',
	prod:'4b5c48de-c8e4-425d-b2bc-8fcead721883',
}

const BugfenderKey = REACT_APP_AMPLIFY_ENV[process.env.REACT_APP_AMPLIFY_ENV];
const ZendekKey = ZENDESK_KEYS[process.env.REACT_APP_AMPLIFY_ENV];

if(BugfenderKey){
	Bugfender.init({
		appKey: BugfenderKey,
	});
	
}
ReactDOM.render(
	<HelmetProvider>
		<CollapseDrawerProvider>
			{/* <NotistackProvider> */}
				<GlobalStyles />
				<ProgressBarStyle />
				{/* <ScrollToTop /> */}
				<Authenticator.Provider>
					<App />
					<Zendesk zendeskKey={ZendekKey} onLoaded={() => {console.log("Zendesk Loaded") }}/>
				</Authenticator.Provider>
			{/* </NotistackProvider> */}
		</CollapseDrawerProvider>
	</HelmetProvider>
, document.getElementById('root'));
