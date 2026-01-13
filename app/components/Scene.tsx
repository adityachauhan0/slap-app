'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, Cloud, Sparkles, MeshTransmissionMaterial } from '@react-three/drei';

function Particles({ count = 800 }) {
    const mesh = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const speed = 0.01 + Math.random() * 0.05;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        const instanceMesh = mesh.current; // Capture for closure safety
        const targetX = (state.mouse.x * viewport.width) / 2;
        const targetY = (state.mouse.y * viewport.height) / 2;

        particles.forEach((particle, i) => {
            let { t, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const s = Math.cos(t);
            const repulsion = Math.max(0, 5 - Math.sqrt(Math.pow(targetX - particle.mx / 100, 2) + Math.pow(targetY - particle.my / 100, 2)));

            particle.mx += (Math.cos(t) + (state.mouse.x * repulsion * 2)) * 0.1;
            particle.my += (Math.sin(t * 0.5) + (state.mouse.y * repulsion * 2)) * 0.1;

            dummy.position.set(
                (particle.mx / 10) + Math.cos(t) + Math.sin(t * xFactor) / 10 + (xFactor / 10),
                (particle.my / 10) + Math.sin(t) + Math.cos(t * yFactor) / 10 + (yFactor / 10),
                (particle.t / 10) + Math.cos(t) + Math.sin(t * zFactor) / 10 + (zFactor / 10)
            );

            dummy.scale.setScalar(1 + repulsion * 0.5);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            instanceMesh.setMatrixAt(i, dummy.matrix);
        });
        instanceMesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
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
                color="#ffffff"
            />
        </instancedMesh>
    );
}

function SorceryBackground() {
    return (
        <group>
            {/* Deep magical fog layers */}
            <Cloud opacity={0.3} speed={0.2} segments={10} bounds={[10, 2, 2]} color="#ffd1dc" position={[0, -5, -10]} />
            <Cloud opacity={0.3} speed={0.2} segments={10} bounds={[10, 2, 2]} color="#a8e6cf" position={[0, 5, -15]} />

            {/* Ambient magic particles in the distance */}
            <Sparkles count={200} scale={15} size={4} speed={0.3} opacity={0.5} color="#fff" />
        </group>
    )
}

export default function Scene() {
    return (
        <div className="absolute inset-0 -z-10 bg-[#e6e2dd]">
            <Canvas camera={{ position: [0, 0, 15], fov: 35 }} dpr={[1, 2]}>
                <fog attach="fog" args={['#e6e2dd', 5, 25]} />
                <ambientLight intensity={0.5} color="#ffd1dc" />
                <spotLight position={[0, 10, 0]} intensity={1} penumbra={1} castShadow />

                {/* The Sorcery Background */}
                <SorceryBackground />

                {/* The Shards */}
                <Particles count={400} />

                <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={30} blur={2.5} far={10} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
