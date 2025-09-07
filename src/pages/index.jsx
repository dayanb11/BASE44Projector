import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Programs from "./Programs";

import ProgramDetails from "./ProgramDetails";

import EditProgram from "./EditProgram";

import Settings from "./Settings";

import ManageEmployees from "./ManageEmployees";

import NewRequirement from "./NewRequirement";

import ManageDivisions from "./ManageDivisions";

import ManageDepartments from "./ManageDepartments";

import ManageDomains from "./ManageDomains";

import ManageProcurementTeams from "./ManageProcurementTeams";

import ManageActivityPool from "./ManageActivityPool";

import ManageEngagementTypes from "./ManageEngagementTypes";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Programs: Programs,
    
    ProgramDetails: ProgramDetails,
    
    EditProgram: EditProgram,
    
    Settings: Settings,
    
    ManageEmployees: ManageEmployees,
    
    NewRequirement: NewRequirement,
    
    ManageDivisions: ManageDivisions,
    
    ManageDepartments: ManageDepartments,
    
    ManageDomains: ManageDomains,
    
    ManageProcurementTeams: ManageProcurementTeams,
    
    ManageActivityPool: ManageActivityPool,
    
    ManageEngagementTypes: ManageEngagementTypes,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Programs" element={<Programs />} />
                
                <Route path="/ProgramDetails" element={<ProgramDetails />} />
                
                <Route path="/EditProgram" element={<EditProgram />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/ManageEmployees" element={<ManageEmployees />} />
                
                <Route path="/NewRequirement" element={<NewRequirement />} />
                
                <Route path="/ManageDivisions" element={<ManageDivisions />} />
                
                <Route path="/ManageDepartments" element={<ManageDepartments />} />
                
                <Route path="/ManageDomains" element={<ManageDomains />} />
                
                <Route path="/ManageProcurementTeams" element={<ManageProcurementTeams />} />
                
                <Route path="/ManageActivityPool" element={<ManageActivityPool />} />
                
                <Route path="/ManageEngagementTypes" element={<ManageEngagementTypes />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}