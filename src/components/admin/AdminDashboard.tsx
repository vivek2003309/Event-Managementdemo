/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AdminDashboard Component
 * Executive Director Command Dashboard for inquiries, live leads sync, and client dossiers.
 */

import React from 'react';
import { AdminInquiriesTable } from './AdminInquiriesTable';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <AdminInquiriesTable />
    </div>
  );
};

export { AdminInquiriesTable };
export default AdminDashboard;
