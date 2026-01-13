'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Text, Float } from '@react-three/drei';

function Particles({ count = 800 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const light = useRef<THREE.PointLight>(null);
    const { viewport, size, mouse } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random initial positions and "personalities" (speed, rotation) for each shard
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() * 0.05;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;

        // Mouse interaction target
        // Convert normalized mouse coordinates to world coordinates roughly
        const targetX = (state.mouse.x * viewport.width) / 2;
        const targetY = (state.mouse.y * viewport.height) / 2;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

            // Update internal time
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Mouse repulsion/attraction logic
            // We want them to float gently but react violently if the mouse gets close
            const dx = targetX - (particle.mx / 100); // approximated current pos
            const dy = targetY - (particle.my / 100);
            const dist = Math.sqrt(dx * dx + dy * dy);

            // "Magical" swirl effect: If close, spin faster and move away
            const repulsion = Math.max(0, 5 - dist); // Influence radius

            // Update position based on noise + mouse influence
            particle.mx += (Math.cos(t) + (state.mouse.x * repulsion * 2)) * 0.1;
            particle.my += (Math.sin(t * 0.5) + (state.mouse.y * repulsion * 2)) * 0.1;

            // Apply to dummy object
            dummy.position.set(
                (particle.mx / 10) + Math.cos(t) + Math.sin(t * xFactor) / 10 + (xFactor / 10),
                (particle.my / 10) + Math.sin(t) + Math.cos(t * yFactor) / 10 + (yFactor / 10),
                (particle.t / 10) + Math.cos(t) + Math.sin(t * zFactor) / 10 + (zFactor / 10)
            );

            // Make them face the mouse slightly
            dummy.scale.setScalar(1 + repulsion * 0.5); // Pulse size on interaction
            dummy.rotation.set(s * 5, s * 5, s * 5);

            dummy.updateMatrix();

            // Update the instance
            mesh.current.setMatrixAt(i, dummy.matrix);

            // Dynamic color change based on interaction could go here (using setColorAt)
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            {/* The Swarm of Shards */}
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.9}
                    roughness={0.1}
                    thickness={1}
                    ior={1.5}
                    chromaticAberration={0.1}
                    iridescence={1}
                    iridescenceIOR={1}
                    clearcoat={1}
                />
            </instancedMesh>
        </>
    );
}

function FloatingHeroText() {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* Maybe add some floating 3D text in the bg if we wanted, but sticking to shards for now */}
        </Float>
    )
}

export default function Scene() {
    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#e6e2dd] to-[#d4d0cb]">
            <Canvas camera={{ position: [0, 0, 15], fov: 35 }} dpr={[1, 2]}>
                <fog attach="fog" args={['#e6e2dd', 10, 30]} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.5} color="#ffd1dc" />
                <pointLight position={[10, 10, 10]} intensity={2} color="#ffb7b2" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#a8e6cf" />
                <spotLight position={[0, 10, 0]} intensity={1} penumbra={1} castShadow />

                <Particles count={400} />

                {/* Soft floor shadow to ground the chaos */}
                <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={30} blur={2.5} far={10} />

                {/* Studio environment for nice reflections on the glass shards */}
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
