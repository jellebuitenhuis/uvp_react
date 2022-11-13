import RunType, {CategoryType, GroupType, ParticipantType, StartGroupType} from "./JsonTypes";
import CredentialsType from "./CredentialsType";

export default interface RunInfoPropsType {
    run: RunType;
    categories: CategoryType[];
    groups : GroupType[];
    participants : ParticipantType[];
    credentials : CredentialsType;
    setCategories: (categories: CategoryType[]) => void;
    setParticipants : (participants: ParticipantType[]) => void;
    setGroups : (groups: GroupType[]) => void;
    startGroups : StartGroupType[];
    setStartGroups: (startGroups: StartGroupType[]) => void;
}

export interface ToolbarPropsType {
    participants: ParticipantType[];
    categories: CategoryType[];
    groups: GroupType[];
    credentials: CredentialsType;
    run: RunType;
    startGroups: StartGroupType[];
    hideMenu?: () => void;
}