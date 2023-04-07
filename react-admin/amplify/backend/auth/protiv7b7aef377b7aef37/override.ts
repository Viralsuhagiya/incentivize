import { AmplifyAuthCognitoStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyAuthCognitoStackTemplate) {
    console.log(">>>>>>>>>>>>>>>>>> OVERRIDE AUTH <<<<<<<<<<<<<<<<<<<<<");
    const userPool = resources.userPool;
    userPool.aliasAttributes = ['email','phone_number'];
    userPool.autoVerifiedAttributes = [];
    resources.userPoolClientWeb.explicitAuthFlows = ["ALLOW_CUSTOM_AUTH","ALLOW_REFRESH_TOKEN_AUTH","ALLOW_USER_SRP_AUTH","ALLOW_USER_PASSWORD_AUTH"];
    console.log("userPoolClientWeb.explicitAuthFlows", resources.userPoolClientWeb.explicitAuthFlows);
}
