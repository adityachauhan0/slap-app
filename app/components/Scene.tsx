'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Geometry({ r, p, y, ...props }: any) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x = r + Math.sin(state.clock.elapsedTime * 0.3);
        ref.current.rotation.y = p + Math.sin(state.clock.elapsedTime * 0.1);
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    });

    const pastelColors = ['#ffb7b2', '#a8e6cf', '#dcedc1', '#ffd3b6'];
    const color = useMemo(() => pastelColors[Math.floor(Math.random() * pastelColors.length)], []);

    return (
        <group ref={ref} {...props}>
            <mesh geometry={props.geometry}>
                <MeshTransmissionMaterial
                    backside
                    samples={4}
                    thickness={0.5}
                    chromaticAberration={0.4}
                    anisotropy={0.3}
                    distortion={0.3}
                    distortionScale={0.5}
                    temporalDistortion={0.2}
                    iridescence={1}
                    iridescenceIOR={1}
                    iridescenceThicknessRange={[0, 1400]}
                    roughness={0.2}
                    color={color}
                />
            </mesh>
        </group>
    );
}

function Geometries() {
    return (
        <group>
            <Geometry r={0.3} p={0.5} position={[-2, 2, -1]} geometry={new THREE.TorusGeometry(0.8, 0.25, 16, 32)} />
            <Geometry r={0.5} p={0.1} position={[2, -1, -2]} geometry={new THREE.IcosahedronGeometry(1.2, 0)} />
            <Geometry r={0.1} p={0.8} position={[-2.5, -2, 0.5]} geometry={new THREE.CapsuleGeometry(0.5, 1.5, 4, 8)} />
            <Geometry r={0.8} p={0.3} position={[3, 1.5, -1]} geometry={new THREE.OctahedronGeometry(1)} />
            <Geometry r={0.4} p={0.4} position={[0, 0, -3]} geometry={new THREE.SphereGeometry(1.2, 32, 32)} />
        </group>
    );
}

export default function Scene() {
    return (
        <div className="absolute inset-0 -z-10 bg-[#e6e2dd]">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <fog attach="fog" args={['#e6e2dd', 5, 20]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Geometries />

                <ContactShadows resolution={512} scale={20} blur={2} opacity={0.25} far={10} color="#8a8a8a" />
                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}
