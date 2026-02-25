import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="تعلم البرمجة بالعربية بطريقة ممتعة وسهلة">
      <main style={{
        padding: '3rem 1rem',
        textAlign: 'center',
        direction: 'rtl'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              رمز - لغة برمجة عربية للأطفال 🎉
            </h1>
            <p style={{
              fontSize: '1.5rem',
              opacity: 0.9,
              marginBottom: '2rem'
            }}>
              تعلم البرمجة بالعربية بطريقة ممتعة وسهلة
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <Link to="/docs/beginner-guide" style={{
              display: 'block',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textDecoration: 'none',
              color: '#333'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#25c2a0',
                marginBottom: '0.5rem'
              }}>
                📖 الدليل الشامل للمبتدئين
              </h2>
              <p style={{
                color: '#666',
                lineHeight: '1.6'
              }}>
                ابدأ رحلتك البرمجية من هنا! دليل شامل يغطي كل أساسيات لغة رمز.
              </p>
            </Link>

            <Link to="/docs/tutorial/01-first-steps" style={{
              display: 'block',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textDecoration: 'none',
              color: '#333'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#25c2a0',
                marginBottom: '0.5rem'
              }}>
                📚 الدروس التعليمية
              </h2>
              <p style={{
                color: '#666',
                lineHeight: '1.6'
              }}>
                10 دروس شاملة من الأساسيات إلى المتقدم.
              </p>
            </Link>

            <Link to="/docs/quick-reference" style={{
              display: 'block',
              padding: '2rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textDecoration: 'none',
              color: '#333'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#25c2a0',
                marginBottom: '0.5rem'
              }}>
                📋 مرجع سريع
              </h2>
              <p style={{
                color: '#666',
                lineHeight: '1.6'
              }}>
                دليل سريع لجميع الكلمات المفتاحية والعمليات.
              </p>
            </Link>
          </div>

          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              marginBottom: '1rem',
              color: '#25c2a0'
            }}>
              🚀 ابدأ رحلتك في البرمجة الآن!
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <Link to="/docs/beginner-guide" style={{
                display: 'block',
                padding: '1rem 1.5rem',
                background: '#25c2a0',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.3s'
              }}>
                ابدأ التعلم
              </Link>
              <Link to="/docs/tutorial/01-first-steps" style={{
                display: 'block',
                padding: '1rem 1.5rem',
                background: '#1da585',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 0.3s'
              }}>
                الدروس
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
