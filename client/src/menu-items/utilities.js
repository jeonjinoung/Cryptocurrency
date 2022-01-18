// assets
import { IconTypography, IconUser, IconWallet, IconCurrencyBitcoin, IconCirclePlus } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconUser,
    IconWallet,
    IconCurrencyBitcoin,
    IconCirclePlus
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-typography',
            title: 'peer',
            type: 'item',
            url: '/user',
            icon: icons.IconCirclePlus,
            breadcrumbs: false
        },
        {
            id: 'util-Block',
            title: 'Block',
            type: 'item',
            url: '/block',
            icon: icons.IconCurrencyBitcoin,
            breadcrumbs: false
        },
        {
            id: 'util-Wallet',
            title: 'Wallet',
            type: 'item',
            url: '/wallet',
            icon: icons.IconWallet,
            breadcrumbs: false
        }
    ]
};

export default utilities;
