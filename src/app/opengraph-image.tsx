import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'Om Singh - Backend Software Engineer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(to bottom right, #0a0a0a, #171717)',
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 80px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              marginBottom: '30px',
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            OS
          </div>
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              lineHeight: 1.1,
              marginBottom: '20px',
              textAlign: 'center',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(to right, #ffffff, #a3a3a3)',
              color: 'transparent',
            }}
          >
            Om Singh
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#a3a3a3',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Backend Software Engineer
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                padding: '10px 24px',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                borderRadius: '9999px',
                fontSize: '24px',
                border: '1px solid rgba(59, 130, 246, 0.5)',
              }}
            >
              System Design
            </div>
            <div
              style={{
                padding: '10px 24px',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#a78bfa',
                borderRadius: '9999px',
                fontSize: '24px',
                border: '1px solid rgba(139, 92, 246, 0.5)',
              }}
            >
              Scalable Architecture
            </div>
            <div
              style={{
                padding: '10px 24px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                borderRadius: '9999px',
                fontSize: '24px',
                border: '1px solid rgba(16, 185, 129, 0.5)',
              }}
            >
              AI Integration
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
