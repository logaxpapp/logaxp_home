// setup.cjs
const fs = require('fs');
const path = require('path');

// Define the folder structure and files
const structure = {
  'api': ['axiosInstance.ts', 'endpoints.ts'],
  'app': ['store.ts', 'hooks.ts'],
  'assets': {
    'images': [],
    'styles': ['globals.css']
  },
  'components': {
    'common': {
      'Button': ['Button.tsx', 'Button.module.css', 'index.ts'],
      // Add more common components here
    },
    'layout': {
      'Header': ['Header.tsx'],
      'Footer': ['Footer.tsx'],
      // Add more layout components here
    }
  },
  'features': {
    'featureA': {
      'components': [],
      'hooks': ['useFeatureAHook.ts'],
      'files': ['featureASlice.ts', 'FeatureA.tsx']
    },
    'featureB': {
      // Define featureB structure here
    }
  },
  'hooks': ['useCustomHook.ts'],
  'pages': {
    'Home': ['Home.tsx', 'Home.module.css'],
    'About': ['About.tsx', 'About.module.css']
    // Add more pages here
  },
  'routes': ['AppRoutes.tsx'],
  'services': ['apiService.ts'],
  'store': {
    'slices': ['exampleSlice.ts'],
    'files': ['index.ts']
  },
  'types': ['index.d.ts'],
  'utils': ['helpers.ts'],
  '': ['App.tsx', 'main.tsx', 'vite-env.d.ts'] // Root files in src/
};

// Function to create folders and files recursively
function createStructure(basePath, struct) {
  for (const key in struct) {
    if (key === '') {
      // Files in the basePath
      const files = struct[key];
      files.forEach(file => {
        const filePath = path.join(basePath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, getInitialContent(file));
          console.log(`Created file: ${filePath}`);
        }
      });
    } else if (typeof struct[key] === 'object') {
      // It's a directory with nested structure
      const dirPath = path.join(basePath, key);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
      createStructure(dirPath, struct[key]);
    } else if (Array.isArray(struct[key])) {
      // It's a directory with files
      const dirPath = path.join(basePath, key);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
      }
      struct[key].forEach(file => {
        const filePath = path.join(dirPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, getInitialContent(file));
          console.log(`Created file: ${filePath}`);
        }
      });
    }
  }
}

// Function to provide initial content based on file type
function getInitialContent(filename) {
  const ext = path.extname(filename);
  switch (ext) {
    case '.tsx':
      return `import React from 'react';

const ${path.basename(filename, ext)}: React.FC = () => {
  return (
    <div>
      {/* ${path.basename(filename, ext)} Component */}
    </div>
  );
};

export default ${path.basename(filename, ext)};
`;
    case '.ts':
      return `// ${filename}
`;
    case '.css':
      return `/* ${filename} */
`;
    case '.d.ts':
      return `// Type definitions
`;
    case 'index.ts':
      return `export * from './${path.dirname(filename)}';
`;
    default:
      return '';
  }
}

// Execute the creation
createStructure(__dirname, structure);

console.log('All folders and files have been created successfully.');
