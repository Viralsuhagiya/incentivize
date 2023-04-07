export const hidePropayDetailReport = (userType,showPropayDetailReport) => {
    return userType == 'worker' || !showPropayDetailReport
}