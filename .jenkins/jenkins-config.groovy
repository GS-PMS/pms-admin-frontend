// ============================================
// JENKINS PIPELINE CONFIGURATION
// ============================================

return [
    // ============================================
    // DOCKER CONFIGURATION
    // ============================================
    docker: [
        // Docker Hub credentials
        credentialsId: 'dockerhub-credentials',
        
        // Docker Hub repository
        repo: 'salmawaleedd',
        
        // Image tags
        latestTag: 'latest'
    ],
    
    // ============================================
    // APPLICATION CONFIGURATION
    // ============================================
    application: [
        // Application name
        name: 'pms-admin-frontend',
        
        // Build commands
        installCommand: 'npm ci',
        buildCommand: 'npm run build',
        
        // Health check
        containerPort: '80',
        healthCheckPath: '/'
    ],
    
    // ============================================
    // DEPLOYMENT CONFIGURATION
    // ============================================
    deployment: [
        // Docker Swarm/Stack configuration
        stackName: 'pms-admin',
        composeServiceName: 'admin-frontend',
        composeFile: 'docker-compose-admin.yml',
        
        // Port configuration
        hostPort: '4200',
        
        // Scaling
        replicas: 2,
        
        // Update strategy
        updateParallelism: 1,
        updateDelay: '10s',
        updateOrder: 'start-first'
    ],
    
    // ============================================
    // PIPELINE BEHAVIOR CONFIGURATION
    // ============================================
    pipeline: [
        // Timeouts
        buildTimeout: 30,  // minutes
        deployTimeout: 300, // seconds
        
        // Health check
        healthCheckAttempts: 10,
        healthCheckInterval: 5, // seconds
        
        // Retry
        maxRetries: 2,
        
        // Cleanup
        pruneImages: true
    ],
    
    // ============================================
    // VALIDATION CONFIGURATION
    // ============================================
    validation: [
        // Minimum disk space (GB)
        minDiskSpace: 1,
        
        // Required tools
        requiredTools: ['docker', 'node', 'npm', 'git'],
        
        // Block direct pushes to main
        blockDirectPushes: true
    ]
]
