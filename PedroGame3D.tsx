/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { POPULAR_VERBS, PRACTICE_QUESTIONS, QuizQuestion, ARM_SPANISH_GRAMMAR } from './SpanishData';
import { ArrowLeft, ArrowRight, Heart, RotateCcw, Volume2, Award, Zap, Sparkles } from 'lucide-react';

interface PedroGame3DProps {
  onBackToMenu: () => void;
}

interface HoopOption {
  text: string;
  isCorrect: boolean;
}

export default function PedroGame3D({ onBackToMenu }: PedroGame3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Core Game State
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed' | 'gameover'>('intro');

  // Game Phase / Conjugation build progression
  const [collectedAuxiliary, setCollectedAuxiliary] = useState<string>('');
  const [collectedParticiple, setCollectedParticiple] = useState<string>('');
  const [ballPhase, setBallPhase] = useState<'auxiliar' | 'participle'>('auxiliar');
  
  // Current options displayed on Left, Middle, and Right Hoops
  const [currentOptions, setCurrentOptions] = useState<HoopOption[]>([]);
  const [selectedHoopIndex, setSelectedHoopIndex] = useState<number | null>(null);
  const [isAnimatingShot, setIsAnimatingShot] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({
    text: "Ընտրիր ճիշտ օպցիան և նետիր գնդակը համապատասխան օղակին:",
    type: 'info'
  });

  const currentQuestion = PRACTICE_QUESTIONS[currentLevel % PRACTICE_QUESTIONS.length];

  // Helper inside loop to read latest state without stale closure values
  const stateRef = useRef({
    gameState: 'intro',
    currentLevel: 0,
    ballPhase: 'auxiliar' as 'auxiliar' | 'participle',
    options: [] as HoopOption[],
    selectedHoopIndex: null as number | null,
    isAnimatingShot: false,
    lives: 3,
    score: 0
  });

  useEffect(() => {
    stateRef.current.gameState = gameState;
    stateRef.current.currentLevel = currentLevel;
    stateRef.current.ballPhase = ballPhase;
    stateRef.current.options = currentOptions;
    stateRef.current.selectedHoopIndex = selectedHoopIndex;
    stateRef.current.isAnimatingShot = isAnimatingShot;
    stateRef.current.lives = lives;
    stateRef.current.score = score;
  }, [gameState, currentLevel, ballPhase, currentOptions, selectedHoopIndex, isAnimatingShot, lives, score]);

  // Audio simulator (pure JS synth)
  const playSound = (type: 'collect' | 'success' | 'error' | 'bounce' | 'swish') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'collect' || type === 'swish') {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'success') {
        // Glorious arpeggio cheer
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start();
        osc.stop(now + 0.5);
      } else if (type === 'error' || type === 'bounce') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio block guard
    }
  };

  // Helper: generates 3 options (1 correct, 2 incorrects) for hoops
  const generateOptionsForTarget = (questionIndex: number, phase: 'auxiliar' | 'participle') => {
    const question = PRACTICE_QUESTIONS[questionIndex % PRACTICE_QUESTIONS.length];
    const correctVal = question.correctParts[phase === 'auxiliar' ? 0 : 1];

    let pool: string[] = [];
    if (phase === 'auxiliar') {
      pool = ARM_SPANISH_GRAMMAR.haberConjugation.map(h => h.form).filter(f => f !== correctVal);
    } else {
      const regularPool = POPULAR_VERBS.map(v => v.participle);
      const irregularPool = ARM_SPANISH_GRAMMAR.irregularParticiples.map(i => i.participle);
      pool = Array.from(new Set([...regularPool, ...irregularPool])).filter(p => p !== correctVal);
    }

    // Shuffle incorrect alternatives
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const incorrects = shuffledPool.slice(0, 2);

    // Form and Shuffle set
    const formed = [correctVal, incorrects[0] || 'as', incorrects[1] || 'an'];
    const optionsWithMeta: HoopOption[] = formed.map(t => ({
      text: t,
      isCorrect: t === correctVal
    }));

    return [...optionsWithMeta].sort(() => 0.5 - Math.random());
  };

  // Generate options when current level/phase shifts
  useEffect(() => {
    if (gameState === 'playing') {
      const opts = generateOptionsForTarget(currentLevel, ballPhase);
      setCurrentOptions(opts);
    }
  }, [currentLevel, ballPhase, gameState]);

  // Restart trigger
  const restartGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setLives(3);
    setCollectedAuxiliary('');
    setCollectedParticiple('');
    setBallPhase('auxiliar');
    setIsAnimatingShot(false);
    setSelectedHoopIndex(null);
    setGameState('playing');
    setFeedback({
      text: "Գնացի՛նք: Ընտրիր ճիշտ Haber բայը՝ Pedro-ի առաջին նետման համար:",
      type: 'info'
    });
    playSound('success');
  };

  // Trigger Basket Throw
  const shootBasketball = (index: number) => {
    if (isAnimatingShot || gameState !== 'playing') return;
    setSelectedHoopIndex(index);
    setIsAnimatingShot(true);
    playSound('swish');
  };

  // Three JS Scene Logic
  useEffect(() => {
    if (gameState !== 'playing' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 350;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffeedd); // Sunset sky tone
    scene.fog = new THREE.FogExp2(0xffeedd, 0.04);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.8);
    camera.lookAt(0, 1.8, -1.5);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffddbb, 1.1);
    sunLight.position.set(4, 10, 4);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // BASKETBALL COURT FLOORS
    const courtGeom = new THREE.BoxGeometry(11, 0.1, 15);
    const courtMat = new THREE.MeshStandardMaterial({
      color: 0xea580c, // Rich clay orange court
      roughness: 0.45,
    });
    const court = new THREE.Mesh(courtGeom, courtMat);
    court.position.set(0, -0.05, -3.5);
    court.receiveShadow = true;
    scene.add(court);

    // Court line decals representing three-point region and key outline
    const keyLineGeom = new THREE.BoxGeometry(4, 0.02, 5);
    const keyLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const keyLine = new THREE.Mesh(keyLineGeom, keyLineMat);
    keyLine.position.set(0, 0.02, -4.5);
    scene.add(keyLine);

    const keyLineInnerGeom = new THREE.BoxGeometry(3.8, 0.02, 4.8);
    const keyLineInnerMat = new THREE.MeshBasicMaterial({ color: 0x334155 }); // Slate filled key
    const keyInner = new THREE.Mesh(keyLineInnerGeom, keyLineInnerMat);
    keyInner.position.set(0, 0.021, -4.5);
    court.add(keyInner);

    // Procedural Palms in back background to give beautiful Spanish Spanish-Coast mood
    const createPalm = (x: number, z: number) => {
      const palm = new THREE.Group();
      const trunkGeom = new THREE.CylinderGeometry(0.12, 0.18, 5, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeom, trunkMat);
      trunk.position.y = 2.5;
      trunk.rotation.z = (Math.random() - 0.5) * 0.15;
      palm.add(trunk);

      // Fronds
      for (let i = 0; i < 6; i++) {
        const frondGeom = new THREE.BoxGeometry(1.6, 0.03, 0.35);
        const frondMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7 });
        const frond = new THREE.Mesh(frondGeom, frondMat);
        frond.position.set(Math.sin((i * Math.PI) / 3) * 0.7, 4.8, Math.cos((i * Math.PI) / 3) * 0.7);
        frond.rotation.y = (i * Math.PI) / 3;
        frond.rotation.z = 0.3;
        palm.add(frond);
      }
      palm.position.set(x, 0, z);
      scene.add(palm);
    };

    createPalm(-5, -9);
    createPalm(5, -9);
    createPalm(-5.2, -6);
    createPalm(5.2, -6);

    // HOOPS ASSEMBLY (3 basketball hoops at X = -2.5, X = 0.0, X = 2.5)
    const hoopsX = [-2.5, 0.0, 2.5];
    const hoopRims: THREE.Mesh[] = [];
    const hoopNets: THREE.Mesh[] = [];

    hoopsX.forEach((hx) => {
      const hoopGroup = new THREE.Group();
      hoopGroup.position.set(hx, 0, -5.5);

      // Pole
      const poleGeom = new THREE.CylinderGeometry(0.08, 0.08, 4.0, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.75, roughness: 0.2 });
      const pole = new THREE.Mesh(poleGeom, poleMat);
      pole.position.set(0, 2.0, -0.6);
      pole.castShadow = true;
      hoopGroup.add(pole);

      // Extension arm
      const armGeom = new THREE.BoxGeometry(0.1, 0.1, 0.8);
      const arm = new THREE.Mesh(armGeom, poleMat);
      arm.position.set(0, 3.4, -0.2);
      hoopGroup.add(arm);

      // Backboard
      const bBoardGeom = new THREE.BoxGeometry(1.4, 0.85, 0.06);
      const bBoardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
      const backboard = new THREE.Mesh(bBoardGeom, bBoardMat);
      backboard.position.set(0, 3.4, 0.2);
      backboard.castShadow = true;
      hoopGroup.add(backboard);

      // Inner red square indicator on backboard
      const squareGeom = new THREE.BoxGeometry(0.45, 0.32, 0.02);
      const squareMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
      const square = new THREE.Mesh(squareGeom, squareMat);
      square.position.set(0, -0.15, 0.045);
      backboard.add(square);

      // Orange Rim (Hoop Ring)
      const rimGeom = new THREE.TorusGeometry(0.24, 0.025, 8, 24);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xe65f12, metalness: 0.1, roughness: 0.5 });
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.set(0, 2.9, 0.42);
      rim.castShadow = true;
      hoopGroup.add(rim);
      hoopRims.push(rim);

      // White Net cylinder cone
      const netGeom = new THREE.CylinderGeometry(0.23, 0.13, 0.4, 12, 1, true);
      const netMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.72
      });
      const net = new THREE.Mesh(netGeom, netMat);
      net.position.set(0, -0.2, 0);
      rim.add(net);
      hoopNets.push(net);

      scene.add(hoopGroup);
    });

    // BASKETBALL
    const ballGeom = new THREE.SphereGeometry(0.22, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Orange
      roughness: 0.75,
    });
    const ball = new THREE.Mesh(ballGeom, ballMat);
    
    // Add thin black orthogonal torus rings around the ball to look like real basketball seams
    const seamMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const seam1Geom = new THREE.TorusGeometry(0.224, 0.007, 6, 32);
    const seam1 = new THREE.Mesh(seam1Geom, seamMat);
    ball.add(seam1);

    const seam2Geom = new THREE.TorusGeometry(0.224, 0.007, 6, 32);
    const seam2 = new THREE.Mesh(seam2Geom, seamMat);
    seam2.rotation.y = Math.PI / 2;
    ball.add(seam2);

    ball.castShadow = true;
    scene.add(ball);

    // Initial ball resting position (Ready in front of Señor Pedro)
    const initialBallPos = new THREE.Vector3(0, 1.25, 3.4);
    ball.position.copy(initialBallPos);

    // SEÑOR PEDRO (Cute voxel-style 3D block model!)
    const pedroGroup = new THREE.Group();
    pedroGroup.position.set(0, 0, 4.1);

    // Torso poncho (Red)
    const torsoGeom = new THREE.BoxGeometry(0.68, 0.78, 0.38);
    const ponchoMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.8 }); // Red Poncho
    const torso = new THREE.Mesh(torsoGeom, ponchoMat);
    torso.position.y = 0.52;
    torso.castShadow = true;
    pedroGroup.add(torso);

    // Spanish central yellow pattern stripe on Poncho
    const stripeGeom = new THREE.BoxGeometry(0.18, 0.78, 0.40);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.8 }); // Yellow stripe
    const ponchoStripe = new THREE.Mesh(stripeGeom, stripeMat);
    ponchoStripe.position.set(0, 0, 0.01);
    torso.add(ponchoStripe);

    // Tan head
    const headGeom = new THREE.BoxGeometry(0.35, 0.35, 0.32);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.9 });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = 1.08;
    head.castShadow = true;
    pedroGroup.add(head);

    // Big bushy voxel moustache (Black)
    const moustacheGeom = new THREE.BoxGeometry(0.28, 0.08, 0.1);
    const moustacheMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const moustache = new THREE.Mesh(moustacheGeom, moustacheMat);
    moustache.position.set(0, -0.06, 0.13);
    head.add(moustache);

    // Sombrero Brim (Flatted yellow cylinder)
    const sombreroBrimGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.03, 16);
    const sombreroMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6 });
    const brim = new THREE.Mesh(sombreroBrimGeom, sombreroMat);
    brim.position.set(0, 1.28, 0);
    pedroGroup.add(brim);

    // Sombrero Cone crown
    const sombreroConeGeom = new THREE.ConeGeometry(0.25, 0.35, 8);
    const crown = new THREE.Mesh(sombreroConeGeom, sombreroMat);
    crown.position.set(0, 1.45, 0);
    pedroGroup.add(crown);

    // Left and Right voxel arm limbs that pivot on shot
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.4, 0.75, 0);
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.4, 0.75, 0);

    const armSegmentGeom = new THREE.BoxGeometry(0.12, 0.45, 0.12);
    const sleeveMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    
    const leftArmMesh = new THREE.Mesh(armSegmentGeom, sleeveMat);
    leftArmMesh.position.y = -0.2;
    leftArmGroup.add(leftArmMesh);

    const rightArmMesh = new THREE.Mesh(armSegmentGeom, sleeveMat);
    rightArmMesh.position.y = -0.2;
    rightArmGroup.add(rightArmMesh);

    pedroGroup.add(leftArmGroup);
    pedroGroup.add(rightArmGroup);

    scene.add(pedroGroup);

    // ANIMATION VARIABLES
    let reqId: number;
    let shootProgress = 0;
    let isSinking = false;
    let isBouncing = false;
    let actionDelay = 0;
    
    const targetHoopPos = new THREE.Vector3();
    const ballStartPos = new THREE.Vector3();

    // Resize Handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 350;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    // MAIN RENDER LOOP / REAL-TIME PHYSICS
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      
      const delta = Math.min(clock.getDelta(), 0.1);
      const isShot = stateRef.current.isAnimatingShot;
      const hoopIdx = stateRef.current.selectedHoopIndex;
      const phase = stateRef.current.ballPhase;
      const opts = stateRef.current.options;

      // Animate Pedro idling slightly
      const timeVal = clock.getElapsedTime();
      torso.position.y = 0.52 + Math.sin(timeVal * 2) * 0.015;
      brim.scale.set(1 + Math.sin(timeVal * 1.5) * 0.01, 1, 1 + Math.sin(timeVal * 1.5) * 0.01);

      if (isShot && hoopIdx !== null && !isSinking && !isBouncing) {
        // Shooting state
        if (shootProgress === 0) {
          ballStartPos.copy(initialBallPos);
          // Target Hoop coordinates: RIM center position
          targetHoopPos.set(hoopsX[hoopIdx], 2.9, -5.08); // Right above the rim projection
          
          // Animate Pedro throwing arms up!
          leftArmGroup.rotation.x = -Math.PI;
          rightArmGroup.rotation.x = -Math.PI;
        }

        shootProgress += delta * 1.6; // sniping snappier fly
        if (shootProgress > 1.0) shootProgress = 1.0;

        // Parabolic Interpolation
        // X/Z linear interpolation
        const currentX = ballStartPos.x + (targetHoopPos.x - ballStartPos.x) * shootProgress;
        const currentZ = ballStartPos.z + (targetHoopPos.z - ballStartPos.z) * shootProgress;
        
        // Height (Y) consists of linear slope + rainbow sine arc height
        const currentY = ballStartPos.y + (targetHoopPos.y - ballStartPos.y) * shootProgress + Math.sin(shootProgress * Math.PI) * 2.8;

        ball.position.set(currentX, currentY, currentZ);

        // Spin the ball backwards for realistic feel
        ball.rotation.x -= delta * 14;

        if (shootProgress >= 1.0) {
          // Check Resolution
          const chosen = opts[hoopIdx];
          if (chosen && chosen.isCorrect) {
            isSinking = true;
            setIsAnimatingShot(false);
            playSound('swish');
          } else {
            isBouncing = true;
            setIsAnimatingShot(false);
            playSound('bounce');
          }
          shootProgress = 0;
        }
      } else if (isSinking) {
        // Sinks through net vertically down
        ball.position.y -= delta * 3.8;
        ball.position.x = targetHoopPos.x;
        ball.position.z = targetHoopPos.z - 0.05; // Slightly behind the back rim

        // Net deformation wiggling
        const netMesh = hoopNets[hoopIdx || 1];
        if (netMesh) {
          netMesh.scale.set(1.22, 0.88, 1.22);
        }

        if (ball.position.y <= 1.2) {
          isSinking = false;
          // Return net back to normal scale
          hoopNets.forEach(n => n.scale.set(1, 1, 1));
          
          // Trigger core state transition
          const currentOpts = stateRef.current.options;
          const targetAnswer = currentOpts[hoopIdx || 0]?.text || '';
          
          if (phase === 'auxiliar') {
            setCollectedAuxiliary(targetAnswer);
            setFeedback({
              text: `Բռնեցի՛նք: "${targetAnswer}"-ը ճիշտ է։ Հիմա ընտրիր համապատասխան դերբայը (Participio)-ն:`,
              type: 'success'
            });
            setBallPhase('participle');
          } else {
            setCollectedParticiple(targetAnswer);
            setFeedback({
              text: `ԳՈ՜Լ: "${targetAnswer}"-ը ճիշտ է։ Դու հաջողությամբ կազմեցիր նախադասությունը։`,
              type: 'success'
            });
            
            // Advance level sequence
            const bigScore = stateRef.current.score + 15;
            setScore(bigScore);
            actionDelay = timeVal + 1.2;
          }

          // Reset ball immediately to hand
          ball.position.copy(initialBallPos);
          leftArmGroup.rotation.x = 0;
          rightArmGroup.rotation.x = 0;
          setSelectedHoopIndex(null);
        }
      } else if (isBouncing) {
        // Bounce off rim randomly and fall
        ball.position.z += delta * 4.2;
        ball.position.y -= delta * 2.8;
        
        if (ball.position.y <= 0.2) {
          isBouncing = false;
          
          // Deduct life
          const nLives = stateRef.current.lives - 1;
          setLives(nLives);
          playSound('error');

          if (nLives <= 0) {
            setGameState('gameover');
          } else {
            setFeedback({
              text: `Օյյյ: Գնդակը դիպավ օղակին ու հետ թռավ: Փորձիր մեկ այլ տարբերակ:`,
              type: 'error'
            });
          }

          // Reset
          ball.position.copy(initialBallPos);
          leftArmGroup.rotation.x = 0;
          rightArmGroup.rotation.x = 0;
          setSelectedHoopIndex(null);
        }
      } else {
        // Idle ball posture resting on Pedro
        ball.position.y = 1.25 + Math.sin(timeVal * 2) * 0.015;
      }

      // Check level delay trigger progression
      if (actionDelay > 0 && timeVal >= actionDelay) {
        actionDelay = 0;
        const currentLvl = stateRef.current.currentLevel;
        if (currentLvl + 1 >= PRACTICE_QUESTIONS.length) {
          setGameState('completed');
          playSound('success');
        } else {
          setCurrentLevel(currentLvl + 1);
          setCollectedAuxiliary('');
          setCollectedParticiple('');
          setBallPhase('auxiliar');
        }
      }

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    // CLEANUPS
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameState, currentLevel]);

  // Handle Game Completion Next Stage
  const handleNextLevelManual = () => {
    setCollectedAuxiliary('');
    setCollectedParticiple('');
    setBallPhase('auxiliar');
    setIsAnimatingShot(false);
    setSelectedHoopIndex(null);

    if (currentLevel + 1 >= PRACTICE_QUESTIONS.length) {
      setGameState('completed');
      playSound('success');
    } else {
      setCurrentLevel(prev => prev + 1);
      setFeedback({
        text: `Անցնում ենք հաջորդին: Թարգմանիր՝ «${PRACTICE_QUESTIONS[(currentLevel + 1) % PRACTICE_QUESTIONS.length].armenian}»`,
        type: 'info'
      });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-amber-50 text-slate-800 rounded-[28px] border-4 border-slate-800 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] relative select-none">
      
      {/* 1. STATUS HEADER */}
      <div className="p-2 sm:p-3 bg-white border-b-4 border-slate-800 flex flex-col md:flex-row justify-between items-center gap-2 z-10 shadow-sm shrink-0">
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button 
            id="btn_back_menu"
            onClick={onBackToMenu}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm shrink-0"
          >
            ← Մենյու
          </button>
          <div className="flex items-center gap-1 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-200 text-[10px] sm:text-xs font-black text-orange-700 shrink-0">
            Մակարդակ՝ {currentLevel + 1}/{PRACTICE_QUESTIONS.length}
          </div>
        </div>

        {/* Targets Armenian sentence */}
        <div className="text-center px-2 py-0.5 md:py-0">
          <span className="text-[8px] sm:text-[9px] text-orange-600 block font-bold uppercase tracking-wide">Թարգմանիր (Հայերեն)</span>
          <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 block line-clamp-2 leading-tight">
            «{currentQuestion.armenian}»
          </span>
        </div>

        {/* Score & Hearts */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 border-t border-slate-100 pt-1.5 md:pt-0 md:border-0 shrink-0">
          <div className="flex items-center gap-1 bg-amber-100 border-2 border-amber-250 px-2.5 py-0.5 rounded-full shadow-sm text-xs font-black text-orange-850">
            <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  heart <= lives ? 'text-red-500 fill-red-500' : 'text-slate-300 fill-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. PEDRO'S FEEDBACK COMMENT */}
      <div className="px-3 py-1 sm:py-1.5 bg-amber-50/50 text-center border-b-2 border-amber-100 flex items-center justify-center gap-1.5 md:gap-2 text-[10px] sm:text-xs shrink-0 font-bold max-w-full">
        <span className="text-orange-600 uppercase tracking-widest text-[8px] sm:text-[9px] bg-orange-100 px-1.5 py-0.5 rounded-md border border-orange-200 font-extrabold shadow-sm shrink-0">Pedro</span>
        <p className={`text-slate-700 break-words line-clamp-1 xs:line-clamp-none ${feedback.type === 'error' ? 'text-rose-600' : ''}`}>
          {feedback.text}
        </p>
      </div>

      {/* 3. THREE.JS VIEWPORT & OVERLAY PANEL */}
      <div className="flex-1 w-full relative min-h-[140px] h-[190px] sm:h-[300px] md:h-[350px] overflow-hidden bg-orange-50/20">
        
        {/* Render Canvas Mount */}
        <div ref={mountRef} className="w-full h-full absolute inset-0" />

        {/* Formula Constructor overlay */}
        <div className="absolute top-2 left-0 right-0 pointer-events-none flex justify-center px-2">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl border-2 border-slate-800 flex items-center gap-1.5 text-center shadow-md max-w-[95%]">
            <span className="text-slate-500 text-[9px] sm:text-[10px] md:text-xs font-extrabold shrink-0">Կազմում ենք՝</span>
            
            {/* Auxiliary Part */}
            <span className={`px-2 py-0.5 rounded-lg font-mono font-black text-[10px] sm:text-xs border transition-all truncate max-w-[80px] sm:max-w-[120px] ${
              collectedAuxiliary 
                ? 'bg-amber-400 border-slate-800 text-slate-900 shadow-sm ring-1 ring-amber-500/20' 
                : 'bg-slate-100 text-slate-300 border-slate-200'
            }`}>
              {collectedAuxiliary || '[haber]'}
            </span>
            <span className="text-slate-400 font-black text-[9px] sm:text-[10px]">+</span>
            
            {/* Participle Part */}
            <span className={`px-2 py-0.5 rounded-lg font-mono font-black text-[10px] sm:text-xs border transition-all truncate max-w-[90px] sm:max-w-[130px] ${
              collectedParticiple 
                ? 'bg-teal-400 border-slate-800 text-slate-900 shadow-sm ring-1 ring-teal-500/20' 
                : 'bg-slate-100 text-slate-300 border-slate-200'
            }`}>
              {collectedParticiple || '[participio]'}
            </span>
          </div>
        </div>

        {/* Arcade Help Bubble showing left/right/middle indicator arrows */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none px-4">
          <div className="bg-slate-900/80 backdrop-blur-xs text-white border border-slate-800 px-3 py-1 rounded-full text-[9px] sm:text-xs font-mono font-bold shadow-md">
            Օղակի ուղղությունները՝ <b>Ձախ (Left)</b> ✦ <b>Կենտրոն (Middle)</b> ✦ <b>Աջ (Right)</b>
          </div>
        </div>

        {/* OVERLAYS FOR MODAL SCREENS */}
        {gameState === 'intro' && (
          <div className="absolute inset-0 bg-amber-50/95 backdrop-blur-sm flex flex-col justify-center items-center text-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-4 border-slate-800 rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] sm:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-4 sm:p-6 w-full max-w-[280px] sm:max-w-sm flex flex-col items-center">
              <div className="bg-orange-100 text-orange-600 p-2 sm:p-2.5 rounded-2xl mb-2 sm:mb-3 border border-orange-200 shadow-sm flex items-center justify-center animate-bounce animate-duration-1000">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black font-sans text-slate-800 mb-0.5 sm:mb-1">
                Pedro's Basketball 3D
              </h2>
              <span className="text-[8px] sm:text-[10px] bg-teal-100 border border-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-bold uppercase mb-1.5 sm:mb-2">
                Pretérito Perfecto
              </span>
              <p className="text-[10px] sm:text-xs text-slate-600 mb-3 sm:mb-5 leading-relaxed font-semibold">
                Բարի գալո՛ւստ Pedro-ի 3D Բասկետբոլի մարզադաշտ: Նախադասությունը ճիշտ թարգմանելու համար նետիր բասկետբոլի գնդակները դեպի ճիշտ իսպաներեն օղակները (սկզբում՝ <b>Haber</b>, հետո՝ <b>Participio</b>)։
              </p>
              <button 
                id="game_btn_start"
                onClick={() => setGameState('playing')}
                className="w-full py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 text-white font-black rounded-xl shadow-md active:translate-y-0.5 active:border-b-2 transition-all text-xs sm:text-sm cursor-pointer"
              >
                ՍԿՍԵԼ ԽԱՂԸ 🏀
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-red-50/95 backdrop-blur-sm flex flex-col justify-center items-center text-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-4 border-slate-800 rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] sm:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-4 sm:p-6 w-full max-w-[280px] sm:max-w-sm flex flex-col items-center">
              <h2 className="text-lg sm:text-2xl font-black text-red-600 mb-1.5 font-display">ԽԱՂՆ ԱՎԱՐՏՎԵՑ</h2>
              <p className="text-slate-600 text-[10px] sm:text-xs mb-3 sm:mb-5 font-bold leading-relaxed">
                Դու կորցրիր բոլոր կյանքերը, բայց մի՛ վհատվիր. սխալները օգնում են սովորել: Փորձե՞նք նորից։
              </p>
              <div className="flex gap-2 w-full">
                <button 
                  id="game_btn_retry"
                  onClick={restartGame}
                  className="flex-1 py-2 sm:py-3 bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700 text-white font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm text-[10px] sm:text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" /> Նորից
                </button>
                <button 
                  onClick={onBackToMenu}
                  className="flex-1 py-1.5 sm:py-3 bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-[10px] sm:text-xs"
                >
                  Մենյու
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="absolute inset-0 bg-teal-50/95 backdrop-blur-sm flex flex-col justify-center items-center text-center p-3 sm:p-4 z-20 overflow-y-auto">
            <div className="bg-white border-4 border-slate-800 rounded-[24px] sm:rounded-[28px] shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] sm:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] p-4 sm:p-6 w-full max-w-[280px] sm:max-w-sm flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center text-xl sm:text-2xl font-bold mb-2 sm:mb-3 animate-bounce">
                🎉
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-emerald-700 mb-1">ՇՆՈՐՀԱՎՈՐՈՒՄ ԵՆՔ</h2>
              <p className="text-[10px] sm:text-xs text-slate-600 max-w-sm mb-2.5 sm:mb-3 leading-relaxed font-semibold">
                Դու հաղթահարեցիր բոլոր 3D բասկետբոլային օղակները և օգնեցիր Pedro-ին կատարյալ սովորել Pretérito Perfecto-ն:
              </p>
              <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl px-3 py-1.5 w-full text-center mb-3 sm:mb-4">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold uppercase">Հավաքած Միավորները</span>
                <span className="text-base sm:text-xl font-mono font-black text-orange-600">{score}</span>
              </div>
              <div className="flex gap-2 w-full">
                <button 
                  id="game_btn_replay"
                  onClick={restartGame}
                  className="flex-1 py-1.5 sm:py-3 bg-teal-500 hover:bg-teal-400 border-b-4 border-teal-700 text-white font-black rounded-xl transition-all cursor-pointer shadow-sm text-[10px] sm:text-xs"
                >
                  Սկսել նորից
                </button>
                <button 
                  onClick={onBackToMenu}
                  className="flex-1 py-1.5 sm:py-3 bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-[10px] sm:text-xs"
                >
                  Գլխավոր Էջ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. CHOOSE HOOP CONTROLS & SHOOT INTERACTIVES */}
      {gameState === 'playing' && (
        <div className="p-2 sm:p-3 bg-slate-50 border-t-2 border-slate-200 shrink-0 select-none z-10">
          <div className="max-w-xl mx-auto flex flex-col gap-2 w-full items-center">
            
            <div className="text-center w-full flex items-center justify-between px-1 mb-1">
              <span className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                🏀 Սեղմի՛ր ճիշտ տարբերակի նետման համար՝
              </span>
              {collectedAuxiliary && !collectedParticiple && (
                <span className="text-[8px] sm:text-[10px] text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded border border-teal-200 font-extrabold uppercase shrink-0">
                  Participio
                </span>
              )}
            </div>

            {/* THREE OPTION HOOP ARCADE PANEL */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
              {currentOptions.map((opt, i) => {
                const directions = ["Ձախ օղակ", "Կենտրոն", "Աջ օղակ"];
                const isTargetSelected = selectedHoopIndex === i;
                
                return (
                  <button 
                    key={i}
                    id={`game_option_${i}`}
                    onClick={() => shootBasketball(i)}
                    disabled={isAnimatingShot}
                    className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-2xl border-2 shadow-sm text-center relative transition-all active:scale-95 select-none min-w-0 ${
                      isAnimatingShot 
                        ? 'opacity-80 scale-95 cursor-not-allowed border-slate-200 bg-slate-100' 
                        : isTargetSelected 
                          ? 'border-orange-500 bg-orange-50 scale-105 shadow-md'
                          : 'bg-white border-slate-300 hover:border-slate-800 hover:bg-orange-50/10 cursor-pointer'
                    }`}
                  >
                    {/* Ring Label Indicator */}
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-400 font-black mb-0.5 truncate max-w-full">
                      {directions[i]}
                    </span>
                    
                    {/* The Spanish word block */}
                    <span id={`hoop_word_${i}`} className="font-mono text-[9px] xs:text-xs sm:text-sm md:text-base font-black text-slate-800 uppercase tracking-tight block truncate max-w-full">
                      {opt.text}
                    </span>

                    {/* Small Basketball Shoot icon overlay */}
                    <div className="mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white border border-orange-600 flex items-center justify-center shadow-xs shrink-0">
                      <span className="text-[8px] sm:text-[9px] font-bold">🏀</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint & Helper manual skipping */}
            <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 px-1 mt-1 font-bold gap-2">
              <span className="truncate">💡 Հուշում՝ {currentQuestion.hint}</span>
              <button 
                id="btn_skip_level"
                onClick={handleNextLevelManual}
                className="text-orange-600 hover:text-orange-850 transition-all font-black uppercase tracking-wider cursor-pointer shrink-0"
              >
                Բաց Թողնել ➔
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. PERSISTENT BASE FOOTER INFO */}
      <div className="p-2 sm:p-3 bg-white border-t-2 border-slate-200 flex justify-between items-center text-[10px] text-slate-500 px-6 font-mono font-bold shrink-0">
        <span>Ռեժիմ՝ «Pedro's 3D Basketball Trainer»</span>
        <div className="flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Ձայնային էֆեկտները միացված են</span>
        </div>
      </div>

    </div>
  );
}
