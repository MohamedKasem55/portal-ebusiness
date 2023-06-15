export interface UserResourceInterface {
  text: string
  icon: string
  link: string
  linkEn: string
}

const iconPath = 'img/'

export const menu: UserResourceInterface[] = [
  {
    text: 'login.resources.Soft Token Guide',
    icon: iconPath + 'soft-token-guide.svg',
    link: '{{docUrl}}/New_Soft_token_user_guide_Arabic.pdf',
    linkEn:'{{docUrl}}/New_Soft_token_user_guide_English.pdf',
  },
  {
    text: 'login.resources.Security token user guide for sub user',
    icon: iconPath + 'security-token-user-guide-for-sub-user.svg',
    link: '{{docUrl}}/Token_User_Manual-Arabic.pdf',
    linkEn:'{{docUrl}}/Token_eCorporate_-_Company_User_Manual_v1.3-English.pdf',
  },
  {
    text: 'login.resources.Security token user guide for admin user',
    icon: iconPath + 'security-token-user-guide-for-admin-user.svg',
    link: '{{docUrl}}/Admin_Token_Manual-Arabic.pdf',
    linkEn:'{{docUrl}}/Token_eCorporate_-_Company_Administrator_Manual_v1.2-English.pdf',
  },
]

export const menupublicSector: UserResourceInterface[] = [
  {
    text: 'login.resources.Soft Token Guide',
    icon: iconPath + 'soft-token-guide.svg',
    link: '{{docUrl}}/New_Soft_token_user_guide_Arabic.pdf',
    linkEn:'{{docUrl}}/New_Soft_token_user_guide_English.pdf',
  },
  {
    text: 'login.resources.wpsAgreement',
    icon: iconPath + 'security-token-user-guide-for-sub-user.svg',
    link: '{{docUrl}}/rajhi_business_Agreement_public_sector_wps_ar.pdf',
    linkEn:'{{docUrl}}/rajhi_business_Agreement_public_sector_wps_ar.pdf',
  },
  {
    text: 'login.resources.ecorpAgreementGovModify',
    icon: iconPath + 'security-token-user-guide-for-admin-user.svg',
    link: '{{docUrl}}/rajhi_business_Agreement_public_sector_modify_ar.pdf',
    linkEn:'{{docUrl}}/rajhi_business_Agreement_public_sector_modify_ar.pdf',
  },

  {
    text: 'login.resources.ecorpAgreementGov',
    icon: iconPath + 'security-token-user-guide-for-admin-user.svg',
    link: '{{docUrl}}/rajhi_business_Agreement_public_sector_ar.pdf',
    linkEn: '{{docUrl}}/rajhi_business_Agreement_public_sector_ar.pdf',
  },
]
