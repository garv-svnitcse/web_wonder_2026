import * as THREE from 'three';

        // DOM ELEMENTS
        const overlay = document.getElementById('overlay');
        const instructionsDiv = document.getElementById('instructions');
        const crosshair = document.getElementById('crosshair');
        const modelStatus = document.getElementById('model-status');

        // RENDERER
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.22;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.inset = '0';
        renderer.domElement.style.zIndex = '0';
        document.body.appendChild(renderer.domElement);

        // SCENE
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#34312c');
        scene.fog = new THREE.Fog('#34312c', 12, 36);

        // CAMERA
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            40
        );
        camera.position.set(0, 1.7, 5.5);
        camera.rotation.order = 'YXZ';

        // LIGHTING
        const ambientLight = new THREE.AmbientLight('#d8e4f0', 1.15);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight('#f2f6ff', '#6a523a', 0.85);
        scene.add(hemiLight);

        const spotlight = new THREE.SpotLight('#fffdf5', 125, 14, Math.PI / 5.5, 0.45, 0.8);
        spotlight.position.set(0, 4.8, 4.2);
        spotlight.target.position.set(0, 2.25, 0.2);
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 2048;
        spotlight.shadow.mapSize.height = 2048;
        spotlight.shadow.camera.near = 0.3;
        spotlight.shadow.camera.far = 10;
        spotlight.shadow.camera.fov = 54;
        spotlight.shadow.bias = -0.00015;
        spotlight.shadow.normalBias = 0.035;
        scene.add(spotlight);
        scene.add(spotlight.target);

        const accentLight1 = new THREE.SpotLight('#ffe8d0', 28, 10, Math.PI / 6.5, 0.5, 0.8);
        accentLight1.position.set(3.5, 4.2, 2.5);
        accentLight1.target.position.set(0, 1.2, 0);
        scene.add(accentLight1);
        scene.add(accentLight1.target);

        const accentLight2 = new THREE.SpotLight('#d8ecff', 22, 10, Math.PI / 6.5, 0.5, 0.8);
        accentLight2.position.set(-3.5, 4.2, -2.5);
        accentLight2.target.position.set(0, 1.2, 0);
        scene.add(accentLight2);
        scene.add(accentLight2.target);

        const dinosaurFillLight = new THREE.DirectionalLight('#eaf4ff', 1.8);
        dinosaurFillLight.position.set(0, 2.4, 5);
        dinosaurFillLight.target.position.set(0, 2.2, 0);
        scene.add(dinosaurFillLight);
        scene.add(dinosaurFillLight.target);

        const cornerLightPositions = [
            [5.5, 3.8, 4.2],
            [-5.5, 3.8, 4.2],
            [5.5, 3.8, -4.2],
            [-5.5, 3.8, -4.2],
        ];
        cornerLightPositions.forEach(([x, y, z]) => {
            const ptLight = new THREE.PointLight('#fff0c8', 16, 9, 1.4);
            ptLight.position.set(x, y, z);
            ptLight.castShadow = false;
            ptLight.shadow.mapSize.width = 512;
            ptLight.shadow.mapSize.height = 512;
            scene.add(ptLight);

            const lamp = new THREE.Mesh(
                new THREE.SphereGeometry(0.14, 24, 16),
                new THREE.MeshBasicMaterial({ color: '#fff0c8' })
            );
            lamp.position.set(x, y, z);
            scene.add(lamp);

            const lampHalo = new THREE.Mesh(
                new THREE.SphereGeometry(0.24, 24, 16),
                new THREE.MeshBasicMaterial({
                    color: '#ffd98a',
                    transparent: true,
                    opacity: 0.22
                })
            );
            lampHalo.position.set(x, y, z);
            scene.add(lampHalo);
        });

        // MATERIALS
        function createCanvasTexture(size, draw) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            draw(ctx, size);
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            return texture;
        }

        const floorTexture = createCanvasTexture(512, (ctx, size) => {
            ctx.fillStyle = '#4c453b';
            ctx.fillRect(0, 0, size, size);
            for (let y = 0; y < size; y += 64) {
                for (let x = 0; x < size; x += 128) {
                    const offset = (y / 64) % 2 ? 64 : 0;
                    ctx.fillStyle = ((x + y) / 64) % 2 ? '#564e43' : '#443d35';
                    ctx.fillRect((x + offset) % size, y, 126, 62);
                }
            }
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 2;
            for (let i = 0; i <= size; i += 64) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(size, i);
                ctx.stroke();
            }
            for (let i = 0; i <= size; i += 128) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, size);
                ctx.stroke();
            }
        });
        floorTexture.repeat.set(3, 2.5);

        const ceilingTexture = new THREE.TextureLoader().load('./ceiling.jpg');
        ceilingTexture.colorSpace = THREE.SRGBColorSpace;
        ceilingTexture.wrapS = THREE.RepeatWrapping;
        ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set(3, 3);

        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.62, metalness: 0.03 });
        const wallMaterial = new THREE.MeshStandardMaterial({ color: '#90EE90', roughness: 0.82, metalness: 0.01 });
        const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture, color: '#ffffff', roughness: 0.88, metalness: 0.01 });
        const baseboardMaterial = new THREE.MeshStandardMaterial({ color: '#5a4a3a', roughness: 0.5, metalness: 0.1 });
        const pedestalBaseMaterial = new THREE.MeshStandardMaterial({ color: '#4b4f55', roughness: 0.48, metalness: 0.08 });
        const pedestalColumnMaterial = new THREE.MeshStandardMaterial({ color: '#687078', roughness: 0.38, metalness: 0.12 });
        const pedestalTopMaterial = new THREE.MeshStandardMaterial({ color: '#b08d57', roughness: 0.32, metalness: 0.22 });
        const sculptureMaterial = new THREE.MeshStandardMaterial({ color: '#d4a745', roughness: 0.22, metalness: 0.95 });
        const accentRingMaterial = new THREE.MeshStandardMaterial({ color: '#e8c860', roughness: 0.15, metalness: 0.9, emissive: '#3d2a00', emissiveIntensity: 0.6 });
        const columnMaterial = new THREE.MeshStandardMaterial({ color: '#e0d8ce', roughness: 0.5, metalness: 0.08 });
        const plaqueMaterial = new THREE.MeshStandardMaterial({ color: '#b8a080', roughness: 0.3, metalness: 0.7 });

        // ROOM CONSTRUCTION
        const ROOM_WIDTH = 20;
        const ROOM_DEPTH = 20;
        const ROOM_HEIGHT = 10;
        const WALL_THICKNESS = 0.35;
        const HALF_W = ROOM_WIDTH / 2;
        const HALF_D = ROOM_DEPTH / 2;

        const floor = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WIDTH, 0.2, ROOM_DEPTH), floorMaterial);
        floor.position.set(0, -0.1, 0);
        floor.receiveShadow = true;
        scene.add(floor);

        const ceiling = new THREE.Mesh(new THREE.BoxGeometry(ROOM_WIDTH, 0.2, ROOM_DEPTH), ceilingMaterial);
        ceiling.position.set(0, ROOM_HEIGHT + 0.1, 0);
        scene.add(ceiling);

        function createWall(width, height, depth, x, y, z, material) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
            mesh.position.set(x, y, z);
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            scene.add(mesh);
        }

        createWall(ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS, 0, ROOM_HEIGHT / 2, -HALF_D, wallMaterial);
        createWall(ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS, 0, ROOM_HEIGHT / 2, HALF_D, wallMaterial);
        createWall(WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH, HALF_W, ROOM_HEIGHT / 2, 0, wallMaterial);
        createWall(WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH, -HALF_W, ROOM_HEIGHT / 2, 0, wallMaterial);

        function createBaseboard(length, x, z, rotY) {
            const h = 0.25, d = 0.12;
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, h, d), baseboardMaterial);
            mesh.position.set(x, h / 2, z);
            if (rotY) mesh.rotation.y = rotY;
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            scene.add(mesh);
        }
        createBaseboard(ROOM_WIDTH, 0, -HALF_D + WALL_THICKNESS / 2, 0);
        createBaseboard(ROOM_WIDTH, 0, HALF_D - WALL_THICKNESS / 2, 0);
        createBaseboard(ROOM_DEPTH, HALF_W - WALL_THICKNESS / 2, 0, Math.PI / 2);
        createBaseboard(ROOM_DEPTH, -HALF_W + WALL_THICKNESS / 2, 0, Math.PI / 2);

        const columnPositions = [
            [HALF_W - 0.6, -HALF_D + 0.6],
            [-HALF_W + 0.6, -HALF_D + 0.6],
            [HALF_W - 0.6, HALF_D - 0.6],
            [-HALF_W + 0.6, HALF_D - 0.6],
        ];
        columnPositions.forEach(([cx, cz]) => {
            const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, ROOM_HEIGHT, 32), columnMaterial);
            col.position.set(cx, ROOM_HEIGHT / 2, cz);
            col.receiveShadow = true;
            col.castShadow = true;
            scene.add(col);
            const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.35, 0.2, 32), columnMaterial);
            cap.position.set(cx, ROOM_HEIGHT - 0.1, cz);
            cap.castShadow = true;
            scene.add(cap);
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.2, 32), columnMaterial);
            base.position.set(cx, 0.1, cz);
            base.receiveShadow = true;
            base.castShadow = true;
            scene.add(base);
        });

        // CENTRAL MONUMENT
        const pedestalGroup = new THREE.Group();
        const tier0 = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.25, 0.24, 64), pedestalBaseMaterial);
        tier0.position.y = 0.12;
        tier0.receiveShadow = true;
        tier0.castShadow = true;
        pedestalGroup.add(tier0);

        const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.85, 0.28, 64), pedestalBaseMaterial);
        tier1.position.y = 0.38;
        tier1.receiveShadow = true;
        tier1.castShadow = true;
        pedestalGroup.add(tier1);

        const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.25, 0.28, 64), pedestalBaseMaterial);
        tier2.position.y = 0.66;
        tier2.receiveShadow = true;
        tier2.castShadow = true;
        pedestalGroup.add(tier2);

        const mainColumn = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.5, 0.95, 64), pedestalColumnMaterial);
        mainColumn.position.y = 1.275;
        mainColumn.receiveShadow = true;
        mainColumn.castShadow = true;
        pedestalGroup.add(mainColumn);

        const topPlatform = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.35, 0.18, 64), pedestalTopMaterial);
        topPlatform.position.y = 1.84;
        topPlatform.receiveShadow = true;
        topPlatform.castShadow = true;
        pedestalGroup.add(topPlatform);

        const accentRing = new THREE.Mesh(new THREE.TorusGeometry(1.47, 0.055, 16, 96), accentRingMaterial);
        accentRing.rotation.x = Math.PI / 2;
        accentRing.position.y = 1.95;
        accentRing.castShadow = true;
        pedestalGroup.add(accentRing);

        const glowRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.43, 0.035, 8, 96),
            new THREE.MeshStandardMaterial({ color: '#ffe8b0', roughness: 0.1, metalness: 0.3, emissive: '#ffcc66', emissiveIntensity: 1.8 })
        );
        glowRing.rotation.x = Math.PI / 2;
        glowRing.position.y = 1.955;
        pedestalGroup.add(glowRing);
        scene.add(pedestalGroup);

        // 3D MODEL PLACEHOLDER 
        const sculptureGroup = new THREE.Group();
        const torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.48, 0.13, 200, 40, 2, 3), sculptureMaterial);
        torusKnot.position.y = 2.2;
        torusKnot.castShadow = true;
        torusKnot.receiveShadow = true;
        sculptureGroup.add(torusKnot);

        const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.03, 16, 100), new THREE.MeshStandardMaterial({ color: '#c0a060', roughness: 0.2, metalness: 0.85 }));
        orbitRing.position.y = 2.2;
        orbitRing.rotation.x = Math.PI / 3.5;
        orbitRing.rotation.y = Math.PI / 5;
        orbitRing.castShadow = true;
        sculptureGroup.add(orbitRing);

        const orbitRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.025, 12, 90), new THREE.MeshStandardMaterial({ color: '#b89050', roughness: 0.25, metalness: 0.8 }));
        orbitRing2.position.y = 2.2;
        orbitRing2.rotation.x = -Math.PI / 4;
        orbitRing2.rotation.z = Math.PI / 6;
        orbitRing2.castShadow = true;
        sculptureGroup.add(orbitRing2);
        scene.add(sculptureGroup);

        const dinosaurGroup = new THREE.Group();
        scene.add(dinosaurGroup);

        const MODEL_URLS = [
            'https://drive.google.com/uc?export=download&id=19cP06Djtrlv5p7tPsXF4sq08jCwBOgf2',
            './dino.glb'
        ];

        async function loadDinosaurModel() {
            try {
                const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
                const gltfLoader = new GLTFLoader();
                let gltf = null;
                let lastError = null;

                for (const modelUrl of MODEL_URLS) {
                    try {
                        gltf = await gltfLoader.loadAsync(modelUrl);
                        break;
                    } catch (error) {
                        lastError = error;
                        console.warn(`Could not load dinosaur model from ${modelUrl}:`, error);
                    }
                }

                if (!gltf) {
                    throw lastError || new Error('No dinosaur model could be loaded.');
                }

                const model = gltf.scene;

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDimension = Math.max(size.x, size.y, size.z);
                const scale = maxDimension > 0 ? 15 / maxDimension : 1;

                model.scale.setScalar(scale);
                model.rotation.y = Math.PI;
                model.updateMatrixWorld(true);

                const centeredBox = new THREE.Box3().setFromObject(model);
                const centeredCenter = centeredBox.getCenter(new THREE.Vector3());
                model.position.set(
                    -centeredCenter.x,
                    -centeredBox.min.y,
                    -centeredCenter.z
                );

                dinosaurGroup.add(model);
                dinosaurGroup.position.set(0, 1.98, 2);
                sculptureGroup.visible = false;
                modelStatus.classList.add('hidden');
            } catch (error) {
                console.error('Could not load dinosaur GLB model:', error);
                modelStatus.textContent = 'Could not load the GLB model. Google Drive may block direct model loading, and the local fallback also failed.';
            }
        }

        loadDinosaurModel();

        // PLAQUE
        const plaqueGroup = new THREE.Group();
        const plaqueBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.5), plaqueMaterial);
        plaqueBase.position.set(0, 0.03, 2.45);
        plaqueBase.castShadow = true;
        plaqueBase.receiveShadow = true;
        plaqueGroup.add(plaqueBase);
        const plaqueStand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.3, 16), plaqueMaterial);
        plaqueStand.position.set(0, 0.2, 2.45);
        plaqueStand.castShadow = true;
        plaqueGroup.add(plaqueStand);
        const plaqueTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.45), plaqueMaterial);
        plaqueTop.position.set(0, 0.37, 2.45);
        plaqueTop.rotation.x = -0.25;
        plaqueTop.castShadow = true;
        plaqueTop.receiveShadow = true;
        plaqueGroup.add(plaqueTop);
        scene.add(plaqueGroup);

        // PLAYER STATE
        const playerPosition = new THREE.Vector3(0, 0, 5.5);
        const PLAYER_HEIGHT = 1.7;
        const PLAYER_RADIUS = 0.4;
        const PLAYER_SPEED = 4.5;
        const PLAYER_SPRINT_MULTIPLIER = 1.7;

        let yaw = 0;
        let pitch = -0.08;
        const PITCH_MIN = -1.3;
        const PITCH_MAX = 0.7;

        const keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false,
        };

        let isPointerLocked = false;
        let velocity = new THREE.Vector3();

        const BOUNDARY_X = HALF_W - WALL_THICKNESS - PLAYER_RADIUS - 0.15;
        const BOUNDARY_Z = HALF_D - WALL_THICKNESS - PLAYER_RADIUS - 0.15;
        const PEDESTAL_SAFE_RADIUS = 3.45;

        function clampPlayerPosition(pos) {
            pos.x = THREE.MathUtils.clamp(pos.x, -BOUNDARY_X, BOUNDARY_X);
            pos.z = THREE.MathUtils.clamp(pos.z, -BOUNDARY_Z, BOUNDARY_Z);
            const distXZ = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
            if (distXZ < PEDESTAL_SAFE_RADIUS && distXZ > 0.001) {
                const nx = pos.x / distXZ;
                const nz = pos.z / distXZ;
                pos.x = nx * PEDESTAL_SAFE_RADIUS;
                pos.z = nz * PEDESTAL_SAFE_RADIUS;
            }
            const columnCenters = [
                { x: HALF_W - 0.6, z: -HALF_D + 0.6 },
                { x: -HALF_W + 0.6, z: -HALF_D + 0.6 },
                { x: HALF_W - 0.6, z: HALF_D - 0.6 },
                { x: -HALF_W + 0.6, z: HALF_D - 0.6 },
            ];
            const COLUMN_SAFE_RADIUS = 0.55 + PLAYER_RADIUS;
            for (const col of columnCenters) {
                const dx = pos.x - col.x;
                const dz = pos.z - col.z;
                const colDist = Math.sqrt(dx * dx + dz * dz);
                if (colDist < COLUMN_SAFE_RADIUS && colDist > 0.001) {
                    const nx = dx / colDist;
                    const nz = dz / colDist;
                    pos.x = col.x + nx * COLUMN_SAFE_RADIUS;
                    pos.z = col.z + nz * COLUMN_SAFE_RADIUS;
                }
            }
            return pos;
        }


        function onKeyDown(e) {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': keys.forward = true; break;
                case 'KeyS': case 'ArrowDown': keys.backward = true; break;
                case 'KeyA': case 'ArrowLeft': keys.left = true; break;
                case 'KeyD': case 'ArrowRight': keys.right = true; break;
                case 'ShiftLeft': case 'ShiftRight': keys.sprint = true; break;
            }
        }

        function onKeyUp(e) {
            switch (e.code) {
                case 'KeyW': case 'ArrowUp': keys.forward = false; break;
                case 'KeyS': case 'ArrowDown': keys.backward = false; break;
                case 'KeyA': case 'ArrowLeft': keys.left = false; break;
                case 'KeyD': case 'ArrowRight': keys.right = false; break;
                case 'ShiftLeft': case 'ShiftRight': keys.sprint = false; break;
            }
        }

        function onMouseMove(e) {
            if (!isPointerLocked) return;
            const sensitivity = 0.0022;
            yaw -= e.movementX * sensitivity;
            pitch -= e.movementY * sensitivity;
            pitch = THREE.MathUtils.clamp(pitch, PITCH_MIN, PITCH_MAX);
        }

        function requestPointerLock() {
            renderer.domElement.requestPointerLock();
        }

        function onPointerLockChange() {
            isPointerLocked = document.pointerLockElement === renderer.domElement;
            if (isPointerLocked) {
                overlay.classList.add('hidden');
                crosshair.classList.add('visible');
            } else {
                overlay.classList.remove('hidden');
                crosshair.classList.remove('visible');
                velocity.set(0, 0, 0);
                keys.forward = false;
                keys.backward = false;
                keys.left = false;
                keys.right = false;
                keys.sprint = false;
            }
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('pointerlockchange', onPointerLockChange);
        window.addEventListener('resize', onResize);

        instructionsDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            requestPointerLock();
        });
        renderer.domElement.addEventListener('click', requestPointerLock);

        // ANIMATION LOOP
        const clock = new THREE.Clock();
        let lastFrameTime = performance.now();

        function animate(timestamp) {
            requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.15);
            const rawDt = Math.min((timestamp - lastFrameTime) / 1000, 0.15);
            lastFrameTime = timestamp;
            const effectiveDt = Math.max(rawDt, 0.001);

            if (isPointerLocked) {
                const forwardDir = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
                const rightDir = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();
                const moveInput = new THREE.Vector3();
                if (keys.forward) moveInput.add(forwardDir);
                if (keys.backward) moveInput.sub(forwardDir);
                if (keys.right) moveInput.add(rightDir);
                if (keys.left) moveInput.sub(rightDir);
                const inputLength = moveInput.length();
                if (inputLength > 1) moveInput.normalize();
                const speed = PLAYER_SPEED * (keys.sprint ? PLAYER_SPRINT_MULTIPLIER : 1.0);
                const targetVel = moveInput.clone().multiplyScalar(speed);
                const velXZ = new THREE.Vector2(velocity.x, velocity.z);
                const targetXZ = new THREE.Vector2(targetVel.x, targetVel.z);
                const acceleration = 18;
                const deceleration = 14;
                if (inputLength > 0.01) {
                    const newXZ = velXZ.lerp(targetXZ, 1 - Math.exp(-acceleration * effectiveDt));
                    velocity.x = newXZ.x;
                    velocity.z = newXZ.y;
                } else {
                    const newXZ = velXZ.lerp(new THREE.Vector2(0, 0), 1 - Math.exp(-deceleration * effectiveDt));
                    velocity.x = newXZ.x;
                    velocity.z = newXZ.y;
                    if (velXZ.length() < 0.02) {
                        velocity.x = 0;
                        velocity.z = 0;
                    }
                }
                playerPosition.x += velocity.x * effectiveDt;
                playerPosition.z += velocity.z * effectiveDt;
                clampPlayerPosition(playerPosition);
            }

            camera.position.set(playerPosition.x, playerPosition.y + PLAYER_HEIGHT, playerPosition.z);
            camera.rotation.set(pitch, yaw, 0);

            const time = timestamp * 0.001;
            sculptureGroup.rotation.y += 0.25 * effectiveDt;
            orbitRing.rotation.z += 0.35 * effectiveDt;
            orbitRing2.rotation.x += 0.3 * effectiveDt;
            const pulse = 1 + Math.sin(time * 1.8) * 0.25;
            glowRing.material.emissiveIntensity = 1.8 * pulse;
            glowRing.scale.setScalar(1 + Math.sin(time * 2.2) * 0.03);
            spotlight.intensity = 300 * (1 + Math.sin(time * 3.7) * 0.04 + Math.sin(time * 7.1) * 0.03);

            renderer.render(scene, camera);
        }

        playerPosition.set(0, 0, 5.5);
        clampPlayerPosition(playerPosition);
        camera.position.set(playerPosition.x, playerPosition.y + PLAYER_HEIGHT, playerPosition.z);
        camera.rotation.set(pitch, yaw, 0);

        requestAnimationFrame(animate);
