import type { Service } from '../types/service';

export const defaultServices: Service[] = [
    {
        id: 's-1',
        icon: 'FileText',
        title: 'Accounting & Tax Compliance',
        description: 'Complete statutory compliance and tax return services for individuals and businesses.',
        features: [
            'Annual statutory accounts',
            'Corporation tax returns (CT600)',
            'Self-assessment tax returns',
            'VAT returns & MTD compliance',
            'HMRC correspondence handling',
        ],
        order: 1,
        subServices: [
            {
                id: 'ss-1-1',
                title: 'Year-End Accounts & Tax Returns',
                description: 'Professional preparation of statutory accounts and tax returns.',
                items: ['Annual statutory accounts', 'Corporation tax returns', 'Self-assessment returns', 'Tax planning advice'],
            },
            {
                id: 'ss-1-2',
                title: 'VAT & Making Tax Digital',
                description: 'Complete VAT compliance and MTD implementation.',
                items: ['VAT return preparation', 'MTD software setup', 'VAT planning', 'HMRC correspondence'],
            },
        ],
    },
    {
        id: 's-2',
        icon: 'Calculator',
        title: 'Payroll & Bookkeeping',
        description: 'Comprehensive payroll management and bookkeeping services with cloud integration.',
        features: [
            'RTI-compliant payroll processing',
            'Auto-enrolment pension support',
            'Monthly or quarterly bookkeeping',
            'Cloud software setup & training',
            'Expense management',
        ],
        order: 2,
        subServices: [
            {
                id: 'ss-2-1',
                title: 'Payroll Services',
                description: 'RTI-compliant payroll processing and comprehensive pension support.',
                items: ['RTI-compliant payroll processing', 'Auto-enrolment pension support', 'P60s and P45s', 'Payroll reporting'],
            },
            {
                id: 'ss-2-2',
                title: 'Bookkeeping Solutions',
                description: 'Accurate monthly bookkeeping and modern cloud software integration.',
                items: ['Monthly or quarterly books', 'Cloud software setup', 'Bank reconciliation', 'Expense management'],
            },
        ],
    },
    {
        id: 's-3',
        icon: 'Building',
        title: 'Business Start-up Support',
        description: 'Complete support for new businesses from formation to first year compliance.',
        features: [
            'Company formation',
            'HMRC registration (PAYE, VAT, etc.)',
            'Business structure advice',
            'Start-up funding guidance',
            'First-year compliance support',
        ],
        order: 3,
        subServices: [
            {
                id: 'ss-3-1',
                title: 'Business Start-Up Support',
                description: 'Comprehensive setup and consulting for new business ventures.',
                items: ['Company formation', 'Business structure', 'Funding guidance', 'Initial compliance setup'],
            },
        ],
    },
    {
        id: 's-4',
        icon: 'TrendingUp',
        title: 'Advisory & Growth Planning',
        description: 'Strategic financial advice and planning to support your business growth.',
        features: [
            'Management accounts',
            'Budgeting and forecasting',
            'Cash flow management',
            'Business growth strategy',
            'Performance analysis',
        ],
        order: 4,
        subServices: [
            {
                id: 'ss-4-1',
                title: 'Strategic Growth & Advisory',
                description: 'Business planning and strategic growth insight for scale-ups and SMEs.',
                items: ['Management accounts', 'Cash flow forecasting', 'Business planning', 'Performance tracking'],
            },
        ],
    },
    {
        id: 's-5',
        icon: 'Users',
        title: 'Specialist Services',
        description: 'Tailored accounting solutions for specific industries and business types.',
        features: [
            'Contractor & freelancer accounting',
            'CIS tax support',
            'Landlord & property tax',
            'Charity & CIC accounts',
            'Not-for-profit organizations',
        ],
        order: 5,
        subServices: [
            {
                id: 'ss-5-1',
                title: 'Landlord & Property Tax',
                description: 'Specialized financial services for property agencies and real estate investors.',
                items: ['Rental income management', 'Property tax returns', 'Capital allowances', 'Portfolio optimization'],
            },
            {
                id: 'ss-5-2',
                title: 'CIS & Contractor Accounting',
                description: 'Dedicated accounting for the construction industry and independent contractors.',
                items: ['CIS compliance', 'Contractor tax returns', 'Subcontractor verification', 'Industry advice'],
            },
            {
                id: 'ss-5-3',
                title: 'Charities & Not-for-Profits',
                description: 'Tailored reporting and compliance support for charitable organizations.',
                items: ['Charity accounts', 'CIC reporting', 'Grant management', 'Charity Commission compliance'],
            },
        ],
    },
];
