import fs from 'fs';
import path from 'path';

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
}

export interface CourseStructure {
  department: string;
  course: string;
  instructor: string;
  type: string;
  files: FileItem[];
  courseDisplayName?: string;
  instructorDisplayName?: string;
  typeDisplayName?: string;
}

/**
 * Find the public/data directory
 */
function findDataDirectory(): string {
  const possiblePaths = [
    path.resolve(process.cwd(), 'public/data'),
    path.resolve(process.cwd(), '../public/data'),
    path.resolve('/public/data'),
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }
  
  // Default fallback
  return path.resolve(process.cwd(), 'public/data');
}

/**
 * Scans the public/data directory and returns the structure
 */
export function scanDataDirectory(): string[] {
  const fullPath = findDataDirectory();
  
  if (!fs.existsSync(fullPath)) {
    console.warn('Data directory not found:', fullPath);
    return [];
  }

  try {
    const departments = fs.readdirSync(fullPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    
    return departments;
  } catch (error) {
    console.error('Error scanning data directory:', error);
    return [];
  }
}

/**
 * Gets all courses for a specific department
 */
export function getDepartmentCourses(department: string): string[] {
  const dataDir = findDataDirectory();
  const deptPath = path.join(dataDir, department);
  
  if (!fs.existsSync(deptPath)) {
    return [];
  }

  try {
    const courses = fs.readdirSync(deptPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    
    return courses;
  } catch (error) {
    console.error(`Error scanning department ${department}:`, error);
    return [];
  }
}

/**
 * Gets all materials for a department with full structure
 */
export function getDepartmentMaterials(department: string): CourseStructure[] {
  const dataDir = findDataDirectory();
  const deptPath = path.join(dataDir, department);
  const materials: CourseStructure[] = [];
  
  if (!fs.existsSync(deptPath)) {
    return materials;
  }

  try {
    const courses = fs.readdirSync(deptPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    for (const course of courses) {
      const coursePath = path.join(deptPath, course.name);
      const instructors = fs.readdirSync(coursePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

      for (const instructor of instructors) {
        const instructorPath = path.join(coursePath, instructor.name);
        const types = fs.readdirSync(instructorPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory());

        for (const type of types) {
          const typePath = path.join(instructorPath, type.name);
          const files = getFilesInDirectory(typePath);

          materials.push({
            department,
            course: course.name,
            instructor: instructor.name,
            type: type.name,
            files,
            courseDisplayName: getCourseDisplayName(department, course.name),
            instructorDisplayName: getInstructorDisplayName(department, instructor.name),
            typeDisplayName: getTypeDisplayName(type.name)
          });
        }
      }
    }

    return materials;
  } catch (error) {
    console.error(`Error getting materials for ${department}:`, error);
    return materials;
  }
}

/**
 * Gets files in a specific directory
 */
export function getFilesInDirectory(dirPath: string): FileItem[] {
  const files: FileItem[] = [];

  if (!fs.existsSync(dirPath)) {
    return files;
  }

  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      const stats = fs.statSync(itemPath);

      files.push({
        name: item.name,
        path: itemPath,
        type: item.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        extension: item.isFile() ? path.extname(item.name) : undefined
      });
    }

    return files.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return files;
  }
}

/**
 * Gets materials for a specific path
 */
export function getMaterialsAtPath(
  department: string,
  course: string,
  instructor: string,
  type: string
): FileItem[] {
  const dataDir = findDataDirectory();
  const materialPath = path.join(dataDir, department, course, instructor, type);
  return getFilesInDirectory(materialPath);
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Load course data for a specific department
 */
export function loadCourseData(department: string): Record<string, { displayName: string; farsiName: string; code: string; aliases: string[] }> {
  const dataDir = findDataDirectory();
  const courseJsonPath = path.join(dataDir, department, 'course.json');
  
  try {
    if (fs.existsSync(courseJsonPath)) {
      const courseJsonContent = fs.readFileSync(courseJsonPath, 'utf-8');
      return JSON.parse(courseJsonContent);
    }
  } catch (error) {
    console.error(`Failed to load course.json for ${department}:`, error);
  }
  
  return {};
}

/**
 * Load instructor data for a specific department
 */
export function loadInstructorData(department: string): Record<string, { displayName: string; farsiName: string; email: string; web: string }> {
  const dataDir = findDataDirectory();
  const instructorJsonPath = path.join(dataDir, department, 'instructor.json');
  
  try {
    if (fs.existsSync(instructorJsonPath)) {
      const instructorJsonContent = fs.readFileSync(instructorJsonPath, 'utf-8');
      return JSON.parse(instructorJsonContent);
    }
  } catch (error) {
    console.error(`Failed to load instructor.json for ${department}:`, error);
  }
  
  return {};
}

/**
 * Load type data from type.json
 */
export function loadTypeData(): Record<string, { displayName: string; description: string }> {
  const dataDir = findDataDirectory();
  const typeJsonPath = path.join(dataDir, 'type.json');
  
  try {
    if (fs.existsSync(typeJsonPath)) {
      const typeJsonContent = fs.readFileSync(typeJsonPath, 'utf-8');
      return JSON.parse(typeJsonContent);
    }
  } catch (error) {
    console.error('Failed to load type.json:', error);
  }
  
  return {};
}

/**
 * Load department data from dept.json
 */
export function loadDepartmentData(): Record<string, { displayName: string; farsiName: string; aliases: string[] }> {
  const dataDir = findDataDirectory();
  const deptJsonPath = path.join(dataDir, 'dept.json');
  
  try {
    if (fs.existsSync(deptJsonPath)) {
      const deptJsonContent = fs.readFileSync(deptJsonPath, 'utf-8');
      return JSON.parse(deptJsonContent);
    }
  } catch (error) {
    console.error('Failed to load dept.json:', error);
  }
  
  return {};
}

/**
 * Get display name for a department
 */
export function getDeptDisplayName(deptKey: string): string {
  const deptData = loadDepartmentData();
  return deptData[deptKey]?.displayName || deptKey.toUpperCase();
}

/**
 * Get display name for a course
 */
export function getCourseDisplayName(department: string, courseKey: string): string {
  const courseData = loadCourseData(department);
  return courseData[courseKey]?.displayName || courseKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get display name for an instructor
 */
export function getInstructorDisplayName(department: string, instructorKey: string): string {
  const instructorData = loadInstructorData(department);
  return instructorData[instructorKey]?.displayName || instructorKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get display name for a type
 */
export function getTypeDisplayName(typeKey: string): string {
  const typeData = loadTypeData();
  return typeData[typeKey]?.displayName || 'etc';
}
