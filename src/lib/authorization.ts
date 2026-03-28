import { authOptions } from "@/lib/authOptions";
import { collections, dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

interface User {
  _id: ObjectId;
  name?: string;
  mobile?: string;
  email?: string;
  role?: string;
  isActive?: string;
  adminPhoto?: string | string[] | null;
  permissions?: string[];
  instituteId?: string;
  password?: string;
}

// Define route permissions mapping
const routePermissions: Record<string, Record<string, string>> = {
  'ins': {
      '/dashboard/institute': 'dashboard',
    '/dashboard/institute/course-entry': 'course',
    '/dashboard/institute/list-of-course': 'course',
    '/dashboard/institute/course-edit': 'course',
    '/dashboard/institute/batch-entry': 'batch',
    '/dashboard/institute/list-of-batch': 'batch',
    '/dashboard/institute/admission-form': 'admission',
    '/dashboard/institute/admission-edit': 'admission',
    '/dashboard/institute/current-students': 'admission',
    '/dashboard/institute/course-completed': 'admission',
    '/dashboard/institute/student-profile-details': 'admission',
    '/dashboard/institute/fees-entry': 'fees',
    '/dashboard/institute/fees-edit': 'fees',
    '/dashboard/institute/list-of-fees': 'fees',
    '/dashboard/institute/attendance-entry': 'studentAttendance',
    '/dashboard/institute/attendance-record': 'studentAttendance',
    '/dashboard/institute/instructor-entry': 'instructor',
    '/dashboard/institute/instructor-edit': 'instructor',
    '/dashboard/institute/instructor-list': 'instructor',
    '/dashboard/institute/transaction-entry': 'generalAccount',
    '/dashboard/institute/transaction-edit': 'generalAccount',
    '/dashboard/institute/transaction-list': 'generalAccount',
    '/dashboard/institute/user-list': 'otherLinks',
    '/dashboard/institute/admin-edit': 'otherLinks',
    '/dashboard/institute/make-admin': 'otherLinks',
    '/dashboard/institute/report': 'otherLinks',
    '/dashboard/institute/settings': 'otherLinks'
  },
  'titb': {
  '/dashboard/admin': 'dashboard',
  '/dashboard/admin/course-entry': 'course',
    '/dashboard/admin/course-edit': 'course',
    '/dashboard/admin/list-of-course': 'course',
    '/dashboard/admin/new-institute-registration': 'institute',
    '/dashboard/admin/pending-apply-registration': 'institute',
    '/dashboard/admin/verified-institute': 'institute',
    '/dashboard/admin/certified-students': 'student',
    '/dashboard/admin/exam-pending-student': 'student',
    '/dashboard/admin/institute-wise-exam-pending': 'student',
    '/dashboard/admin//bulk-sms': 'communication',
    '/dashboard/admin/fees-receive-collection': 'fees',
    '/dashboard/admin/fees-receive-list': 'fees',
    '/dashboard/admin/exam-mark-entry': 'examMark',
    '/dashboard/admin/users-management': 'systemSettings',
    '/dashboard/admin/system-settings-and-frontend': 'systemSettings',
    '/dashboard/admin/make-admin': 'systemSettings',
    '/dashboard/admin/admin-edit': 'systemSettings',
  }
};
const PUBLIC_ROUTES = [
  '/dashboard/profile',
  '/dashboard/settings',
  '/dashboard/notifications',
  '/api/user/profile',
  '/api/notifications'
];
type AuthorizationResult = 
  | { success: true; user: Omit<User, 'password'>; status: 200 }
  | { success: false; error: string; status: 401 | 403 | 404 | 500 };

  async function authorizationCheck(refererPath?: string): Promise<AuthorizationResult> {
    try {
      const userCollection = dbConnect(collections.users);
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return { success: false, error: "Unauthorized Access", status: 401 };
      }
  
      const user = await userCollection.findOne({ 
        _id: new ObjectId(session.user.id) 
      }) as unknown as User;
  
      if (!user) {
        return { success: false, error: "User not found", status: 404 };
      }
   if(user?.role !== "titb super admin"){
          if(user?.isActive !== "active" ){
             return { success: false, error: "You don't have authorization, contact with author", status: 404 };
          }
        }
      // Skip permission checks for public routes
      if (refererPath && PUBLIC_ROUTES.some(route => refererPath.startsWith(route))) {
        return { 
          success: true, 
          user: { ...user }, 
          status: 200 
        };
      }
  
      // Rest of your existing checks...
      const isSuperAdmin = ["titb super admin", "ins super admin"].includes(user.role || "");
      
      if (!isSuperAdmin && refererPath) {
        const userType = user.role?.includes('titb') ? 'titb' : 'ins';
        const permissionsMap = routePermissions[userType];
        const requiredPermission = permissionsMap?.[refererPath];
    
        if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
          return { 
            success: false, 
            error: `Forbidden: Missing ${requiredPermission} permission`, 
            status: 403 
          };
        }
      }
  
      const isAdmin = isSuperAdmin || ["titb admin", "ins admin"].includes(user.role || "");
      
      if (!isAdmin) {
        if (!user.instituteId) {
          return { 
            success: false, 
            error: "Institute ID required", 
            status: 401 
          };
        }
        return { success: false, error: "Insufficient privileges", status: 401 };
      }
  
      return { 
        success: true, 
        user: { ...user}, 
        status: 200 
      };
  
    } catch (error) {
      console.error("Authorization error:", error);
      return { 
        success: false, 
        error: "Internal server error", 
        status: 500 
      };
    }
  }

export { authorizationCheck };