import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    small?: boolean;
}

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ small, children, ...props }) => {
    const size = small ? 'w-4 h-4' : 'w-6 h-6';
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${size} ${props.className || ''}`} {...props}>
            {children}
        </svg>
    );
};

export const AppLogo: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="50" cy="50" r="48" fill="#4280f5"/>
        <g fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
            {/* Stylized '한' (han) */}
            {/* ㅎ (hieut) with speech bubble */}
            <path d="M 30 30 h 22" />
            <path d="M 28 55 v -12 a 13 13 0 0 1 13 -13 h 0 a 13 13 0 0 1 13 13 v 6 a 7 7 0 0 1 -7 7 h -12 l -7 7 z" />

            {/* ㅏ (a vowel) */}
            <path d="M 70 28 v 44" />
            <path d="M 58 50 h 12" />

            {/* ㄴ (nieun) */}
            <path d="M 28 80 h 42" />
        </g>
    </svg>
);


export const DictionaryIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></IconWrapper>
);

export const TranslateIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 7.061 14.287 7.5 15.5 7.5c1.657 0 3-1.343 3-3s-1.343-3-3-3c-1.213 0-2.317.439-3.166 1.136m0 0l-2.83 2.83" /></IconWrapper>
);

export const VocabIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></IconWrapper>
);

export const SRSIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.696L7.985 9.348m11.667 0l-3.181 3.183m0 0l-3.181-3.183" /></IconWrapper>
);

export const ConversationIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457.167-.92.22-1.392h.02c.025-.245.05-.487.07-.732c.094-.854.275-1.72.53-2.522c.257-.801.598-1.558 1-2.267c.402-.709.88-1.36 1.415-1.966c.535-.606 1.148-1.147 1.818-1.622c.67-.475 1.405-.882 2.18-1.22c.773-.337 1.58-.595 2.408-.782c.827-.187 1.683-.29 2.555-.337c.872-.047 1.745-.047 2.617 0c4.97 0 9 3.694 9 8.25c0 .346-.02.69-.058 1.03z" /></IconWrapper>
);

export const PronunciationIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></IconWrapper>
);

export const HandwritingIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></IconWrapper>
);

export const QuizIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></IconWrapper>
);

export const AcademicCapIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></IconWrapper>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l.448-.178c.55-.22 1.156-.22 1.706 0l.448.178c.55.22 1.02.685 1.11 1.227.09.542-.12 1.09-.5 1.528l-.337.42a2.25 2.25 0 01-3.235 0l-.337-.42c-.38-.438-.59-1.007-.5-1.528zM19.5 10.5c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-2.25A1.125 1.125 0 0019.5 9v1.5zM3 10.5c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-2.25A1.125 1.125 0 003 9v1.5zM12 15.75c-1.036 0-1.875.84-1.875 1.875v.191a3.375 3.375 0 003.75 0v-.191c0-1.036-.84-1.875-1.875-1.875zM10.343 15.94c.09.542.56 1.007 1.11 1.227l.448.178c.55-.22 1.156-.22 1.706 0l.448.178c.55-.22 1.02.685 1.11-1.227.09-.542-.12-1.09-.5-1.528l-.337-.42a2.25 2.25 0 01-3.235 0l-.337.42c-.38.438-.59 1.007-.5 1.528z" clipRule="evenodd" fillRule="evenodd" /></IconWrapper>
);

export const UpgradeIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const MediaIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM12.75 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0z" /></IconWrapper>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></IconWrapper>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></IconWrapper>
);

export const PlanIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.75c0-.621-.504-1.125-1.125-1.125H14.25m-7.5 0L12 3m0 0l3.75 4.5M12 3v13.5" /></IconWrapper>
);

export const MicIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m6 7.5v-1.5m-6-6v-1.5a6 6 0 016-6v0a6 6 0 016 6v1.5m0 0" /></IconWrapper>
);

export const ListBulletIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></IconWrapper>
);

export const BrainCircuitIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3.75h.008v.008H12V3.75zM12 9a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0112 9zm4.125 3a.75.75 0 100 1.5.75.75 0 000-1.5zM7.875 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75h.008v.008H12v-.008z" /></IconWrapper>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5L18 15l-1.5 1.5" /></IconWrapper>
);

export const HanjaIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.125 1.125 0 010 2.25H5.625a1.125 1.125 0 010-2.25z" /></IconWrapper>
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></IconWrapper>
);

export const BookOpenIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></IconWrapper>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></IconWrapper>
);

export const HistoryIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const SpeakerIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></IconWrapper>
);

export const ArrowsRightLeftIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18M16.5 3L21 7.5m0 0L16.5 12M21 7.5H3" /></IconWrapper>
);

export const ClipboardDocumentIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></IconWrapper>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></IconWrapper>
);

export const PlusCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a6.01 6.01 0 00-3.75 0M12 5.25a2.25 2.25 0 012.25 2.25c0 1.24-1.01 2.25-2.25 2.25S9.75 8.74 9.75 7.5A2.25 2.25 0 0112 5.25z" /></IconWrapper>
);

export const InformationCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></IconWrapper>
);

export const TrophyIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.056-5.228 9.75 9.75 0 011.056-5.228M16.5 18.75h-9a9.75 9.75 0 00-1.056-5.228 9.75 9.75 0 00-1.056-5.228M16.5 18.75V5.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.5 5.25h11" /></IconWrapper>
);

export const PlayCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></IconWrapper>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const SunIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></IconWrapper>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></IconWrapper>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></IconWrapper>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>
);

export const GoogleIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 48 48" className="w-5 h-5" {...props}><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.566,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
);

export const FacebookIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-blue-600" {...props}><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
);

export const ZaloIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" {...props}><path fill="#0068ff" d="M13.011 10.334l-1.91 1.815a.25.25 0 000 .367l1.91 1.815a.28.28 0 00.384 0l1.91-1.815a.25.25 0 000-.367l-1.91-1.815a.28.28 0 00-.384 0zM21.5 8.163V15.5a2.5 2.5 0 01-2.5 2.5H5a2.5 2.5 0 01-2.5-2.5V8.163a2.5 2.5 0 012.5-2.5h14a2.5 2.5 0 012.5 2.5zM7.17 11.232a1.023 1.023 0 100 2.046 1.023 1.023 0 000-2.046zm1.25-2.083h-2.5v6h2.5v-6zM17.5 15.5v-2.5H15V11h2.5v4.5zm0-5.5H15v1.25h2.5V10zM12.5 8.5H10v6h2.5v-6z"/></svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.667 1.667 0 01-1.667-.985V5.653z" /></IconWrapper>
);

export const PauseIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></IconWrapper>
);

export const AnalyzeIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></IconWrapper>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></IconWrapper>
);

export const SendIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></IconWrapper>
);

export const XCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.696L7.985 9.348m11.667 0l-3.181 3.183m0 0l-3.181-3.183" /></IconWrapper>
);

export const StopCircleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.254 9.254 9 9.563 9h4.874c.309 0 .563.254.563.563v4.874c0 .309-.254.563-.563.563H9.563A.562.562 0 019 14.437V9.564z" /></IconWrapper>
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></IconWrapper>
);

export const CalendarDaysIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 14.25h.008v.008H12v-.008z" /></IconWrapper>
);

export const ChatBubbleIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457.167-.92.22-1.392h.02c.025-.245.05-.487.07-.732c.094-.854.275-1.72.53-2.522c.257-.801.598-1.558 1-2.267c.402-.709.88-1.36 1.415-1.966c.535-.606 1.148-1.147 1.818-1.622c.67-.475 1.405-.882 2.18-1.22c.773-.337 1.58-.595 2.408-.782c.827-.187 1.683-.29 2.555-.337c.872-.047 1.745-.047 2.617 0c4.97 0 9 3.694 9 8.25c0 .346-.02.69-.058 1.03z" /></IconWrapper>
);

export const TargetIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></IconWrapper>
);

export const FireIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.622a8.982 8.982 0 013-3.812A8.98 8.98 0 0115.362 5.214z" /></IconWrapper>
);

export const SlidersHorizontalIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0h9.75m-9.75-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></IconWrapper>
);

export const StarIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.404a.563.563 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 21.03a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988h5.404a.563.563 0 00.475-.31l2.125-5.111z" /></IconWrapper>
);

export const FlagIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" /></IconWrapper>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" /></IconWrapper>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></IconWrapper>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></IconWrapper>
);

export const Bars2Icon: React.FC<IconProps> = (props) => (
    <IconWrapper {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6h16.5" /></IconWrapper>
);