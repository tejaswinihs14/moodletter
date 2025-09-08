import React from "react";

// Material-UI style icon components using Unicode symbols and CSS
const IconWrapper = ({ children, className = "w-5 h-5", ...props }) => (
  <span 
    className={`inline-flex items-center justify-center ${className}`}
    style={{ 
      fontFamily: 'Material Icons, sans-serif',
      fontSize: 'inherit',
      fontWeight: 'normal',
      fontStyle: 'normal',
      display: 'inline-block',
      lineHeight: 1,
      textTransform: 'none',
      letterSpacing: 'normal',
      wordWrap: 'normal',
      whiteSpace: 'nowrap',
      direction: 'ltr',
      ...props.style
    }}
    {...props}
  >
    {children}
  </span>
);

// Email/Newsletter Icons
export const EmailIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ✉
  </IconWrapper>
);

export const SendIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ➤
  </IconWrapper>
);

// Mood/Theme Icons
export const CelebrationIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ⭐
  </IconWrapper>
);

export const UrgentIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ⚡
  </IconWrapper>
);

export const ThankYouIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🙏
  </IconWrapper>
);

export const CalmIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🌊
  </IconWrapper>
);

export const ProfessionalIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    💼
  </IconWrapper>
);

export const CreativeIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🎨
  </IconWrapper>
);

export const MotivationalIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🚀
  </IconWrapper>
);

export const SeasonalIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🍂
  </IconWrapper>
);

// Action Icons
export const AddIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ➕
  </IconWrapper>
);

export const EditIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ✏️
  </IconWrapper>
);

export const DeleteIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🗑️
  </IconWrapper>
);

export const SaveIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    💾
  </IconWrapper>
);

// Navigation Icons
export const HomeIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🏠
  </IconWrapper>
);

export const CampaignsIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    📋
  </IconWrapper>
);

export const AnalyticsIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    📊
  </IconWrapper>
);

// Status Icons
export const SuccessIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ✅
  </IconWrapper>
);

export const ErrorIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ❌
  </IconWrapper>
);

export const WarningIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ⚠️
  </IconWrapper>
);

export const InfoIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ℹ️
  </IconWrapper>
);

// Analytics Icons
export const OpenIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    👁️
  </IconWrapper>
);

export const ClickIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🖱️
  </IconWrapper>
);

export const LeadIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🎯
  </IconWrapper>
);

// Group/User Icons
export const GroupIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    👥
  </IconWrapper>
);

export const UserIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    👤
  </IconWrapper>
);

// Performance Icons
export const TrendingUpIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    📈
  </IconWrapper>
);

export const TrendingDownIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    📉
  </IconWrapper>
);

export const TrendingFlatIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    ➡️
  </IconWrapper>
);

// Other Icons
export const PreviewIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    👁️
  </IconWrapper>
);

export const LinkIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    🔗
  </IconWrapper>
);

export const LoadingIcon = ({ className, ...props }) => (
  <IconWrapper className={className} {...props}>
    <span className="animate-spin">⟳</span>
  </IconWrapper>
);
