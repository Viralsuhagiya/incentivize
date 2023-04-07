import { Ability, AbilityBuilder } from '@casl/ability';

function subjectName(item) {
    if (!item || typeof item === 'string') {
        return item;
    }
    return item.__type;
}
const ability = new Ability([], { subjectName });
function defineRulesFor(groups) {    
    const { can, rules } = new AbilityBuilder(Ability);
    if (groups.includes('group_platform_manager')) {
        can('create', 'Company');
    }
    if (groups.includes('group_company_admin')) {
        can('read', 'Company');
    }
    if (groups.includes('group_supervisor')) {
        can('read', 'Company');
    }
    if (groups.includes('group_user')) {
        can('read', 'Company');
    }
    ability.update(rules);
}

export { defineRulesFor };
export default ability;
