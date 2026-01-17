"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { locale } = useLanguage();
  const isPortuguese = locale === "pt";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-soft-green tracking-tight">
            {isPortuguese
              ? "Sobre o InsightEats & Iterio Tech"
              : "About InsightEats & Iterio Tech"}
          </h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full border border-soft-green text-soft-green text-sm font-semibold hover:bg-soft-green hover:text-white transition-colors"
          >
            {isPortuguese ? "Voltar para o Painel" : "Back to Dashboard"}
          </Link>
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {isPortuguese
              ? "Apresentação do Projeto Iterio Tech"
              : "Iterio Tech | Project Presentation"}
          </h2>
          {isPortuguese ? (
            <>
              <p className="text-gray-600 mb-3">
                A Iterio Tech é uma iniciativa de desenvolvimento de software de ponta
                dedicada a ligar dados complexos à experiência humana diária. Somos
                especializados na criação de soluções digitais intuitivas e de alto
                desempenho que capacitam os utilizadores para assumir o controlo do seu
                crescimento e bem-estar pessoal.
              </p>
              <p className="text-gray-600 mb-3">
                No cerne da nossa filosofia está a crença de que a tecnologia deve ser
                uma facilitadora silenciosa, proporcionando clareza sem complexidade.
                Com projetos como o InsightEats, aproveitamos arquiteturas full-stack
                modernas para transformar o rastreio nutricional numa viagem perfeita e
                esclarecedora.
              </p>
              <p className="text-gray-600">
                A Iterio Tech está empenhada em construir ferramentas que não sejam
                apenas funcionais, mas essenciais para um futuro mais saudável e
                orientado por dados.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-3">
                Iterio Tech is a cutting-edge software development initiative dedicated
                to bridging the gap between complex data and daily human experience. We
                specialize in crafting intuitive, high-performance digital solutions
                that empower users to take control of their personal growth and
                well-being.
              </p>
              <p className="text-gray-600 mb-3">
                At the core of our philosophy is the belief that technology should be a
                quiet enabler—providing clarity without complexity. With projects like
                InsightEats, we leverage modern full-stack architectures to transform
                nutritional tracking into a seamless, insightful journey.
              </p>
              <p className="text-gray-600">
                Iterio Tech is committed to building tools that are not just functional,
                but essential for a data-driven, healthier future.
              </p>
            </>
          )}
          <div className="mt-4 rounded-xl bg-white border border-soft-green/10 px-4 py-3">
            <p className="text-sm text-gray-700 font-medium">
              {isPortuguese
                ? "A nossa missão é capacitar as pessoas com insights claros e orientados por dados para que possam fazer melhores escolhas de estilo de vida."
                : "Our mission is to empower individuals with clear, data-driven insights to make better lifestyle choices."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            {isPortuguese ? "Secção de Contato" : "Contact"}
          </h2>
          {isPortuguese ? (
            <>
              <p className="text-gray-600 mb-3">
                Estamos sempre abertos a colaborações, feedback ou dúvidas sobre os
                nossos projetos. Sinta-se à vontade para contactar a nossa equipa:
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-3">
                Have questions or suggestions? Reach out to us.
              </p>
              <p className="text-gray-600 mb-3">
                We are always open to collaboration, feedback, or inquiries regarding
                our projects. Feel free to connect with our team:
              </p>
            </>
          )}
          <p className="text-gray-800 font-semibold">
            {isPortuguese ? "E-mail: " : "Email: "}
            <a
              href="mailto:iteriotech@gmail.com"
              className="text-soft-green hover:text-soft-green-hover underline underline-offset-2"
            >
              iteriotech@gmail.com
            </a>
          </p>
          <p className="mt-3 text-gray-600 text-sm">
            {isPortuguese
              ? "Iterio Tech – Simplificando a complexidade, uma linha de código de cada vez."
              : "Iterio Tech – Simplifying complexity, one line of code at a time."}
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-full bg-soft-green text-white text-sm font-semibold hover:bg-soft-green-hover transition-colors shadow-md"
          >
            {isPortuguese ? "Voltar para o Painel" : "Back to Dashboard"}
          </Link>
        </div>
      </div>
    </div>
  );
}

